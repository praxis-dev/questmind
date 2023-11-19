import * as mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  important: { type: Boolean, default: false },
});

export const dialogueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [messageSchema],
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
  messageId: string;
  sender: string;
  message: string;
  timestamp: Date;
  important: boolean;
}

export interface Dialogue extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  messages: Message[];
  isBranch: boolean;
  parentDialogueId: mongoose.Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt?: Date;
}
