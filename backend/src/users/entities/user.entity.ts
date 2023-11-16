// user.entity.ts

import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
});

export interface User extends mongoose.Document {
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
}
