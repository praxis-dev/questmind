// user.entity.ts

import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Make password optional
  resetToken: String,
  resetTokenExpiration: Date,
});

export interface User extends mongoose.Document {
  email: string;
  password?: string; // Make password optional
  resetToken?: string;
  resetTokenExpiration?: Date;
}
