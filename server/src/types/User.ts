import { Document } from 'mongoose';

export type UserDocument = {
    username: string;
} & Document;