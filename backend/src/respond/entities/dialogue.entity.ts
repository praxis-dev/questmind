import * as mongoose from 'mongoose';

export const dialogueSchema = new mongoose.Schema({
  dialogueId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  isBranch: { type: Boolean, default: false },
  parentDialogueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dialogue',
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export interface Dialogue extends mongoose.Document {
  dialogueId: string;
  userId: mongoose.Schema.Types.ObjectId;
  text: string;
  isBranch: boolean;
  parentDialogueId: mongoose.Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt?: Date;
}
