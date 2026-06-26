import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  avatarColor: { type: String, default: 'bg-[#7030E0]' },
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User ?? model('User', UserSchema);
