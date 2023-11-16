//dialogue.entity.ts

import * as mongoose from 'mongoose';

export const dialogueSchema = new mongoose.Schema({
  dialogueId: { type: String, required: true, unique: true }, // Added line
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export interface Dialogue extends mongoose.Document {
  dialogueId: string; // Added line
  userId: mongoose.Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}
