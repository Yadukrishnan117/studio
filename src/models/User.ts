import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: string;
  department?: string;
  branch?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  permissions?: string[];
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['super_admin', 'admin', 'manager', 'technician', 'sales', 'viewer'], default: 'viewer' },
    department: String,
    branch: String,
    phone: String,
    avatar: String,
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    permissions: [String],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
