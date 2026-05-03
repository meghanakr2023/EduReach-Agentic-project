import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongoClient: MongoClient | null = null;

const getMongoClient = async (): Promise<MongoClient> => {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGODB_URI || "");
    await mongoClient.connect();
  }
  return mongoClient;
};

const getEmbeddings = () => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set in .env!");
  }
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });
};

const getVectorStore = async () => {
  const client = await getMongoClient();
  const collection = client.db("edureach_db").collection("knowledge_docs");
  return new MongoDBAtlasVectorSearch(getEmbeddings(), {
    collection: collection as any,
    indexName: "edureachvectorindex",
    textKey: "text",
    embeddingKey: "embedding",
  });
};

export const initializeKnowledgeBase = async (): Promise<void> => {
  const client = await getMongoClient();
  const collection = client.db("edureach_db").collection("knowledge_docs");

  const docWithEmbedding = await collection.findOne({
    embedding: { $exists: true, $not: { $size: 0 } },
  });

  if (docWithEmbedding) {
    const count = await collection.countDocuments();
    console.log(` Knowledge base ready (${count} chunks with embeddings)`);
    return;
  }

  const existingCount = await collection.countDocuments();
  if (existingCount > 0) {
    console.log(` Found ${existingCount} chunks — re-indexing...`);
    await collection.deleteMany({});
  }

  console.log(" Indexing knowledge base...");

  const embeddings = getEmbeddings();
  try {
    const testResult = await embeddings.embedQuery("test");
    console.log(` API key OK — embedding dimensions: ${testResult.length}`);
  } catch (error: any) {
    console.error(" Embedding test failed!", error.message);
    throw error;
  }

  const filePath = path.join(
    __dirname,
    "../../knowledge-base/edureach-knowledge.txt"
  );
  const loader = new TextLoader(filePath);
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const allSplits = await splitter.splitDocuments(docs);
  console.log(`    Split into ${allSplits.length} chunks`);

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: collection as any,
    indexName: "edureachvectorindex",
    textKey: "text",
    embeddingKey: "embedding",
  });

  await vectorStore.addDocuments(allSplits);

  const verifyDoc = await collection.findOne({
    embedding: { $exists: true, $not: { $size: 0 } },
  });

  if (verifyDoc && Array.isArray(verifyDoc.embedding) && verifyDoc.embedding.length > 0) {
    console.log(`    ${allSplits.length} chunks stored successfully ✅`);
  } else {
    await collection.deleteMany({});
    throw new Error("Embeddings are empty!");
  }
};

export const getRAGResponse = async (question: string): Promise<string> => {
  try {
    const vectorStore = await getVectorStore();
    const retriever = vectorStore.asRetriever(4);

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.7,
    });

    const systemPrompt = `You are Mysore College Bot, a friendly AI assistant for Mysore College, Mysore, Karnataka.

Use the following context to answer the student's question:
{context}

BRANCH RECOMMENDATION RULES (when student shares KCET rank):
- Rank 1-6000: Recommend AI and Data Science (Avg pkg: Rs.11.5 LPA) ⭐ Best choice
- Rank 6001-8000: Recommend CSE (Avg pkg: Rs.10.2 LPA)
- Rank 8001-10000: Recommend IT (Avg pkg: Rs.8.8 LPA)
- Rank 10001-15000: Recommend ECE (Avg pkg: Rs.7.2 LPA)
- Rank 15001-25000: Recommend ME (Avg pkg: Rs.5.5 LPA)
- Rank 25001-35000: Recommend CE (Avg pkg: Rs.5.0 LPA)
- Rank above 35000: Government quota not available — suggest management quota

MANAGEMENT QUOTA FEES (when government quota not available or student wants specific branch):
- CSE: Rs.2,50,000/year | AI and DS: Rs.3,00,000/year | IT: Rs.2,25,000/year
- ECE: Rs.2,00,000/year | ME: Rs.1,75,000/year | CE: Rs.1,50,000/year
- Hostel: Rs.80,000/year (same for all) | Education loans: SBI, HDFC, ICICI

GOVERNMENT QUOTA FEE: Rs.1,50,000/year tuition (all branches through KCET counseling).

RESPONSE RULES:
- Be warm, encouraging and clear
- Use emojis to make responses readable
- If student shares KCET rank → immediately give branch recommendation
- If student asks about specific branch → check if rank qualifies, else explain management quota
- Always mention scholarships when fees seem high
- End with: "💬 Want a detailed personalized email with your recommendation? Click Talk to Counselor!"
- If info not in context: "I don't have that specific detail. Please click Talk to Counselor!"`;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["human", "{question}"],
    ]);

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe((docs: any[]) =>
          docs.map((d) => d.pageContent).join("\n\n")
        ),
        question: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    const response = await chain.invoke(question);
    return response;
  } catch (error) {
    console.error(" RAG Error:", error);
    return "I'm having trouble right now. Please try again or click 'Talk to Counselor'.";
  }
};