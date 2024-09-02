import mongoose from "mongoose";
import { Post } from "../../model/PostModel";
import { IPost, ISavePostData } from "../entities/IPost";
import { IPostRepository } from "./IPostRepository";

export class PostRepository implements IPostRepository {
    async save(post: ISavePostData): Promise<{ success: boolean; message: string; data?: IPost }> {
        try {
            console.log('00');
            console.log(post.description, '-------------------------------description of the post----------')
            const newPost = new Post({
                userId: post.userId,
                description: post.description,
                location: post.location,
                imageUrl: post.imageUrl,
                originalname: post.originalname,
            });
            console.log('0000');
            const savedPost = await newPost.save();
            console.log(savedPost);
            console.log('0000000000')
            if (!savedPost) {
                return { success: false, message: "Can't save data" };
            }
            console.log('000000000000================')
            return { success: true, message: "Data saved successfullt", data: savedPost };
        } catch (error) {
            const err = error as Error;
            console.log('Error saving posts', err);
            return { success: false, message: err.message }
        }
    }

    async findAllPost(page:number): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {
            const posts = await Post.find({ isDelete: false }).sort({ created_at: -1 }).limit(page*5);
            if (!posts) {
                return { success: false, message: "no posts found" };
            }
            return { success: true, message: "post found", data: posts };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching all post", err);
            throw new Error(`Error fetching post: ${err.message}`);
        }
    }

    async findUserPost(id: String): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {

            const posts = await Post.find({ userId: id }).sort({ created_at: -1 });
            console.log(posts, '----post data');
            if (!posts || posts.length === 0) {
                return { success: false, message: "No posts found" };
            }
            return { success: true, message: "Posts found", data: posts };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching users post", err);
            throw new Error(`Error fetching users post: ${err.message}`);
        }
    }

    async getNewPosts() {
        try {
            const posts = await Post.find().sort({ _id: -1 }).limit(5);
            const count = await Post.find({}).countDocuments();
            return { posts, count }
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching users post", err);
            throw new Error(`Error fetching users post: ${err.message}`);
        }
    }
}

