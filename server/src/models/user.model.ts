import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'customer' | 'admin';
    phone?: string;
    avatar?: string;
    addresses: Array<{
        street: string;
        city: string;
        state?: string;
        isDefault: boolean;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
        phone: { type: String, default: '' },
        avatar: { type: String, default: '' },
        addresses: [
            {
                street: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String },
                isDefault: { type: Boolean, default: false }
            }
        ]
    },
    { timestamps: true }
);

export const User = model<IUser>('User', userSchema);