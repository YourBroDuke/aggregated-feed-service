import mongoose, { Document } from 'mongoose';

interface IFollowedUser extends Document {
  platform: string;
  username: string;
  name: string;
  avatar: string;
  description: string;
  profileUrl: string;
  followedAt: Date;
}

const followedUserSchema = new mongoose.Schema({
  platform: { type: String, required: true},
  username: { type: String, required: false, default: '' },
  name: { type: String, required: false, default: '' },
  avatar: { type: String, required: false, default: '' },
  description: { type: String, required: false, default: '' },
  profileUrl: { type: String, required: true, unique: true },
  followedAt: { type: Date, required: true }
}, { timestamps: true });

export const FollowedUser = mongoose.model<IFollowedUser>('FollowedUser', followedUserSchema); 