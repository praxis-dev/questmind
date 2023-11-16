import * as mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // 'user' or 'ai'
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Timestamp for each message
});

export const dialogueSchema = new mongoose.Schema({
  dialogueId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [messageSchema], // Array of message objects
  isBranch: { type: Boolean, default: false },
  parentDialogueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dialogue',
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export interface Message extends mongoose.Document {
  sender: string;
  message: string;
  timestamp: Date;
}

export interface Dialogue extends mongoose.Document {
  dialogueId: string;
  userId: mongoose.Schema.Types.ObjectId;
  messages: Message[];
  isBranch: boolean;
  parentDialogueId: mongoose.Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt?: Date;
}
