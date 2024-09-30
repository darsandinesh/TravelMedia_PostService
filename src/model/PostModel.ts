// import mongoose, { Document, Schema } from "mongoose";
// import { IPost } from "../domain/entities/IPost";

// export interface IPostDocument extends IPost, Document { }

// const postSchema: Schema = new Schema({
//     userId: {
//         type: String,
//         required: true,
//     },
//     imageUrl: {
//         type: [String],
//     },
//     // originalname: {
//     //     type: [String],
//     // },
//     description: {
//         type: String,
//     },
//     location: {
//         type: String
//     },
//     likes: [
//         {
//             UserId: {
//                 type: String,
//                 required: true,
//             },
//             // postUser: {
//             //     type: String,
//             //     required: true,
//             //     default: ''
//             // },
//             createdAt: {
//                 type: Date,
//                 default: Date.now,
//             },
//         },
//     ],
//     comments: [
//         {
//             _id: { type: Schema.Types.ObjectId, auto: true },
//             UserId: {
//                 type: String,
//                 required: true,
//             },
//             content: {
//                 type: String,
//                 required: true,
//             },
//             avatar: {
//                 type: String,
//             },
//             userName: {
//                 type: String
//             },
//             isEdited: {
//                 type: Boolean,
//                 default: false
//             },
//             createdAt: {
//                 type: Date,
//                 default: Date.now,
//             },
//         },
//     ],
//     reportPost: [
//         {
//             UserId: {
//                 type: String,
//                 required: true
//             },
//             reason: {
//                 type: String,
//                 required: true,
//             }
//         }
//     ],
//     isDelete: {
//         type: Boolean,
//         default: false,
//     },
//     created_at: {
//         type: Date,
//         default: Date.now
//     }
// });

// export const Post = mongoose.model<IPostDocument>("Post", postSchema);



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
    replies: [replySchema], // Array of replies for the comment
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
    comments: [commentSchema], // Use commentSchema for comments
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
