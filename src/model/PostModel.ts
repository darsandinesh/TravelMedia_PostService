import mongoose, { Document, Schema } from "mongoose";
import { IPost } from "../domain/entities/IPost";

export interface IPostDocument extends IPost, Document { }

const postSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: [String],
    },
    // originalname: {
    //     type: [String],
    // },
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
            postUser: {
                type: String,
                required: true,
                default: ''
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    comments: [
        {
            _id: { type: Schema.Types.ObjectId, auto: true },
            UserId: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            isEdited: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    reportPost: [
        {
            UserId: {
                type: String,
                required: true
            },
            reason: {
                type: String,
                required: true,
            }
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