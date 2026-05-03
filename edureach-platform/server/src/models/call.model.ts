import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";

export interface ICall extends Document {
  callId: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  preferredCourse: string;
  status: string;
  transcript?: string;
  summary?: string;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CallSchema = new Schema<ICall>(
  {
    callId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    preferredCourse: {
      type: String,
      default: "Not specified",
    },
    status: {
      type: String,
      default: "initiated",
    },
    transcript: {
      type: String,
      default: null,
    },
    summary: {
      type: String,
      default: null,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Call = mongoose.model<ICall>("Call", CallSchema);
export default Call;