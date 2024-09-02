import { IAddPostData, IPost } from "../../domain/entities/IPost";
import { uploadFileToS3, fetchFileFromS3 } from "../../infrastructure/s3/s3Actions";
import { PostRepository } from "../../domain/respositories/PostRepository";
import { Document } from "mongoose";

class PostService {
    private postRepo: PostRepository;

    constructor() {
        this.postRepo = new PostRepository();
    }

    async addPost(post: IAddPostData): Promise<{ success: boolean, message: string, data?: IPost }> {
        try {
            console.log('data recived in the use-case post applciaotn')
            let imageUrls: string[] = [];
            let originalNames: string[] = [];
            console.log('1')
            if (post.images && post.images.length > 0) {
                imageUrls = await Promise.all(
                    post.images.map(async (image) => {
                        const buffer = Buffer.isBuffer(image.buffer) ? image.buffer : Buffer.from(image.buffer);
                        const imageUrl = await uploadFileToS3(buffer, image.originalname);
                        return imageUrl;
                    })
                );
                originalNames = post.images.map((image) => image.originalname);
            }

            console.log('2')

            const newPost = {
                userId: post.userId,
                description: post.description,
                location: post.place,
                imageUrl: imageUrls,
                originalName: originalNames
            }
            console.log('3');
            const result = await this.postRepo.save(newPost);
            console.log('4')
            console.log(result);
            if (!result.success) {
                return { success: false, message: "Data not saved, error occurred" };
            }

            return { success: true, message: "Data successfully saved" };


        } catch (error) {
            const err = error as Error;
            return { success: false, message: err.message }
        }
    }

    async getAllPosts(page:number): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {
            const result = await this.postRepo.findAllPost(page);
            if (!result.success || !result.data) {
                return { success: false, message: "No data found" };
            }

            const postsWithImages = await Promise.all(result.data?.map(async (post) => {
                if (post.imageUrl && post.imageUrl.length > 0) {
                    const imageUrls = await Promise.all(post.imageUrl.map(async (imageKey) => {
                        const s3Url = await await fetchFileFromS3(imageKey, 604800);
                        return s3Url
                    }))
                    const plainPost = (post as Document).toObject();
                    return {
                        ...plainPost, imageUrl: imageUrls,
                    };
                }
                return post;
            }))
            return { success: true, message: 'Images and user datas sent', data: postsWithImages };
        } catch (error) {
            console.error("Error in user Posts:", error);
            throw new Error(`Error fetching user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async fetchUserPosts(id: string): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {
            const result = await this.postRepo.findUserPost(id);
            if (!result.success || !result.data) {
                return { success: false, message: "No posts found" };
            }
            console.log(result);

            const postsWithImages = await Promise.all(result.data?.map(async (post) => {
                if (post.imageUrl && post.imageUrl.length > 0) {
                    const imageUrls = await Promise.all(post.imageUrl.map(async (imageKey) => {
                        const s3Url = await fetchFileFromS3(imageKey, 604800);
                        return s3Url
                    }))
                    const plainPost = (post as Document).toObject();
                    return {
                        ...plainPost, imageUrl: imageUrls,
                    };
                }
                return post;
            }))

            console.log(postsWithImages, '----------------------')
            return { success: true, message: "Images and user datas sent", data: postsWithImages };

        } catch (error) {
            console.error("Error in user Posts:", error);
            throw new Error(`Error fetching user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async getNewPosts(): Promise<{ success: boolean, message: string, count?: any, data?: IPost[] }> {
        try {
            const result = await this.postRepo.getNewPosts()
            const count = result.count;
            if (!result) {
                return { success: false, message: "No data found" }
            }

            const postsWithImages = await Promise.all(result.posts?.map(async (post) => {
                if (post.imageUrl && post.imageUrl.length > 0) {
                    const imageUrls = await Promise.all(post.imageUrl.map(async (imageKey) => {
                        const s3Url = await fetchFileFromS3(imageKey, 604800);
                        return s3Url
                    }))
                    const plainPost = (post as Document).toObject();
                    return {
                        ...plainPost, imageUrl: imageUrls,
                    };
                }
                return post;
            }))

            return { success: true, message: 'Data fetched successful', count: count, data: postsWithImages }
        } catch (error) {
            console.error("Error in user Posts: getNewPosts:", error);
            throw new Error(`Error fetching user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}

export { PostService };