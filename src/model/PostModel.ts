import mongoose, { Document, Schema } from "mongoose";
import { IPost } from "../domain/entities/IPost";

export interface IPostDocument extends IPost, Document { }

const replySchema: Schema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    UserId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    userName: {
        type: String
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const commentSchema: Schema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    UserId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    userName: {
        type: String
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    replies: [replySchema],
});

const postSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: [String],
    },
    description: {
        type: String,
    },
    location: {
        type: String
    },
    likes: [
        {
            UserId: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    comments: [commentSchema], 
    reportPost: [
        {
            UserId: {
                type: String,
                required: true
            },
            reason: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                enum: ['pending', 'accepted', 'rejected'],
                default: 'pending'
            },
            reportDate: {
                type: Date,
                default: Date.now
            },
        }
    ],
    isDelete: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export const Post = mongoose.model<IPostDocument>("Post", postSchema);
