# 🎓 EduReach Platform

A full-stack **AI-powered college information platform** for EduReach College, Hyderabad.

It features:
- 🌐 React frontend
- ⚙️ Node.js/Express backend
- 🤖 RAG-based chatbot
- 📞 AI voice counseling via Vapi

---

## 🚀 Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- Axios
- Lucide React
- React Hot Toast

### Backend
- Node.js (v20+)
- Express v5
- TypeScript
- Mongoose
- MongoDB Atlas
- LangChain
- Google Gemini (chat + embeddings)
- Vapi (outbound calling)
- bcryptjs
- JWT


---

## ⚙️ Prerequisites

- Node.js v20+
- MongoDB Atlas account (with Vector Search enabled)
- Google AI Studio API key (Gemini)
- Vapi account (optional, for voice calls)

---

## 🛠️ Setup

### 1️⃣ Clone & Install

```bash
# Install client dependencies
cd edureach-platform/client
npm install

# Install server dependencies
cd ../server
npm install

😁Envirinment variable
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/edureach_db

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

GOOGLE_API_KEY=your_google_gemini_api_key

# Optional — for AI voice calls
VAPI_API_KEY=your_vapi_api_key
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id
VAPI_ASSISTANT_ID=your_vapi_assistant_id


MongoDB Atlas Vector Search Index
{
  "fields": [{
    "numDimensions": 3072,
    "path": "embedding",
    "similarity": "cosine",
    "type": "vector"
  }]
}
👉 Index Name: edureachvectorindex

▶️ Running the App Locally
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
🌐 URLs
Frontend: http://localhost:5173
Backend: http://localhost:5000


# Build client
cd client
npm run build

# Build server
cd server
npm run build
npm start

Meghana K R
B.E. CS&D
Mysore University

⭐ If you like this project, give it a star!

LIVE DEMO : "https://edu-reach-agentic-project.vercel.app/"
---


