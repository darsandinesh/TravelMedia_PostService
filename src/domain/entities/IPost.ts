import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
    UserId: string;
    imageUrl: string[];
    originalname: string[];
    description: string;
    isDelete: boolean;
    likes?: Array<{
        UserId: string;
        postUser: string;
        createdAt: Date;
    }>;
    comments?: Array<{
        _id?: mongoose.Types.ObjectId;
        UserId: string;
        content: string;
        isEdited: boolean;
        createdAt: Date;
    }>;
    reportPost?: Array<{
        UserId: string;
        reason: string;
    }>
    created_at: Date;
}


export interface IAddPostData {
    userId: string;
    description: string;
    place: string;
    images?: {
        buffer: Buffer;
        originalname: string;
    }[];
    postId?:string
}


export interface ISavePostData {
    userId: string;
    description?: string;
    location?: string
    imageUrl?: string[];
    originalname?: string[];
}