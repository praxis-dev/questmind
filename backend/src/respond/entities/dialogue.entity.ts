// dialogue.entity.ts

import * as mongoose from 'mongoose';

export const dialogueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export interface Dialogue extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}
