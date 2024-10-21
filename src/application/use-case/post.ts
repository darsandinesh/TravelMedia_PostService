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
                console.log('5');
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

    async editPost(post: IAddPostData): Promise<{ success: boolean, message: string, data?: any }> {
        try {
            let imageUrls: string[] = [];
            let originalNames: string[] = [];

            console.log(post.images)

            if (post.images && post.images.length > 0) {
                imageUrls = await Promise.all(
                    post.images.map(async (image) => {
                        const buffer = Buffer.isBuffer(image.buffer) ? image.buffer : Buffer.from(image.buffer);
                        const imageUrl = await uploadFileToS3(buffer, image.originalname);
                        return imageUrl;
                    })
                );
                console.log('1212')
                originalNames = post.images.map((image) => image.originalname);
            }
            console.log()
            const editPost = {
                userId: post.userId,
                postId: post.postId,
                description: post.description,
                location: post.place,
                imageUrl: imageUrls,
                originalName: originalNames
            }


            const result = await this.postRepo.edit(editPost);

            if (!result.success) {
                return { success: false, message: "Data not saved, error occurred" };
            }

            return { success: true, message: "Data edited successful" };

        } catch (error) {
            const err = error as Error;
            return { success: false, message: err.message }
        }
    }

    async deletePost(id: string): Promise<{ success: boolean, message: string }> {
        try {

            console.log(id);
            const response: any = await this.postRepo.deletPost(id);

            if (response.modifiedCount == 0) {
                return { success: false, message: 'unable to delte the post' }
            }
            return { success: true, message: 'post deleted' }
        } catch (error) {
            const err = error as Error;
            return { success: false, message: err.message }
        }
    }

    async reportPost(data: { userId: string, postId: string, reason: string }): Promise<{ success: boolean, message: string }> {
        try {
            const response = await this.postRepo.reportPost(data);

            if (response) {
                return { success: true, message: 'Reported the post' }
            } else {
                return { success: false, message: 'Unable to report the post' }
            }

        } catch (error) {
            const err = error as Error;
            return { success: false, message: err.message }
        }
    }

    async getAllPosts(page: number): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {
            const result = await this.postRepo.findAllPost(page);
            if (!result.success || !result.data) {
                return { success: false, message: "No data found" };
            }

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
            return { success: true, message: 'Images and user datas sent', data: postsWithImages };
        } catch (error) {
            console.error("Error in user Posts:", error);
            throw new Error(`Error fetching user posts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async fetchUserPosts(id: string): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {
            const result = await this.postRepo.findUserPost(id);
            console.log(result, '-------res in fetchUserpost')
            if (!result.success || !result.data) {
                return { success: true, message: "No posts found" };
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

    async likePost(data: { logged: string, postId: string }) {
        try {
            const like = await this.postRepo.likePost(data);
            if (!like) {
                return { success: false, message: 'unable to like the post' }
            }
            return { success: true, message: 'liked the post' }
        } catch (error) {
            console.log('Error in likePost in applicaiton user service', error);
            return { success: false, message: 'Someting went wrong' }
        }
    }

    async unlikePost(data: { logged: string, postId: string }) {
        try {
            const like = await this.postRepo.unlikePost(data);
            if (!like) {
                return { success: false, message: 'unable to like the post' }
            }
            return { success: true, message: 'liked the post' }
        } catch (error) {
            console.log('Error in likePost in applicaiton user service', error);
            return { success: false, message: 'Someting went wrong' }
        }
    }

    async comment(data: any) {
        try {

            console.log(data, '---------data in the post service ')
            const comment = await this.postRepo.comment(data);
            if (!comment) {
                return { success: false, message: 'unable to comment the post' }
            }
            return { success: true, message: 'commented the post' }
        } catch (error) {
            console.log('Error in likePost in applicaiton user service', error);
            return { success: false, message: 'Someting went wrong' }
        }
    }

    async deleteComment(data: any) {
        try {
            const comment = await this.postRepo.deleteComment(data);
            if (!comment) {
                return { success: false, message: 'unable to delete comment' }
            }
            return { success: true, message: 'commented deleted' }
        } catch (error) {
            console.log('Error in likePost in applicaiton user service', error);
            return { success: false, message: 'Someting went wrong' }
        }
    }

    // single post view

    async getPost(postId: string): Promise<{ success: boolean, message: string, data?: any }> {
        try {
            const result = await this.postRepo.getPost(postId);
            console.log(result, 'in application for getPost');

            if (!result) {
                return { success: false, message: "No data found" };
            }

            // Wait for all the image URLs to be fetched
            const imagesUrls = await Promise.all(result.data?.imageUrl.map(async (imageKey: any) => {
                const s3Url = await fetchFileFromS3(imageKey, 604800);
                return s3Url;
            }) || []);

            if (!imagesUrls) {
                return { success: false, message: 'Unable to fetch images' };
            }

            // Return the success response with resolved image URLs
            console.log(imagesUrls, '------image for the post');
            result.data.imageUrl = imagesUrls
            console.log(result);
            return { success: true, message: 'Data retrieved successfully', data: result };

        } catch (error) {
            console.log("Error in getPost in application -->", error);
            return { success: false, message: 'Something went wrong' };
        }
    }


    // find buddy 

    async findBuddy(data: any) {
        try {
            let imageUrls: string[] = [];
            let originalNames: string[] = [];
            if (data.images && data.images.length > 0) {
                imageUrls = await Promise.all(
                    data.images.map(async (image: any) => {
                        const buffer = Buffer.isBuffer(image.buffer) ? image.buffer : Buffer.from(image.buffer);
                        const imageUrl = await uploadFileToS3(buffer, image.originalname);
                        return imageUrl
                    })
                );
                originalNames = data.images.map((image: any) => image.originalname);
            }
            console.log('after image upload to s3')

            console.log(data.data)

            const parsedPreferences = JSON.parse(data.data.preferences)
            console.log(parsedPreferences, 'parsedPreferences')

            const newPost = {
                userId: data.data.userId,
                travelDate: data.data.travelDate,
                travelType: parsedPreferences.travelType,
                location: data.data.location,
                description: data.data.description,
                maxParticipants: data.data.maxParticipants,
                isPrivate: data.data.isPrivate,
                travelDuration: Number(data.data.travelDuration),
                preferences: {
                    budget: parsedPreferences.budget,
                    accommodation: parsedPreferences.accommodation,
                    transportMode: parsedPreferences.transportMode,
                },
                mediaUrls: imageUrls
            }
            console.log('create new post')
            const result = await this.postRepo.saveFindBuddy(newPost)

            if (!result?.success) {
                return { success: false, message: "Data not saved, error occurred" };
            }
            return { success: true, message: "Data successfully saved", data };

        } catch (error) {

        }
    }

    async getfindBuddy(page: number) {
        try {
            const result = await this.postRepo.getfindBuddy(page);
            if (!result.success || !result.data) {
                return { success: false, message: "No data found" };
            }

            const postsWithImages = await Promise.all(result.data?.map(async (post) => {
                if (post.mediaUrls && post.mediaUrls.length > 0) {
                    const mediaUrls = await Promise.all(post.mediaUrls.map(async (imageKey) => {
                        const s3url = await fetchFileFromS3(imageKey, 604800);
                        return s3url
                    }))
                    const plainPost = (post).toObject();
                    return {
                        ...plainPost, mediaUrls: mediaUrls,
                    }
                }
                return post;
            }))
            return { success: true, message: 'Images and user datas sent', data: postsWithImages };
        } catch (Error) {

        }
    }

    async deleteImage(data: { index: number, postId: string }) {
        try {
            const result = await this.postRepo.deleteImage(data);
            console.log(result);
            if (result.success && result.res?.modifiedCount == 1) {
                return { success: true, message: 'Image delted' }
            }
            return { success: false, messsage: 'Something went wrong' }
        } catch (error) {
            return { success: false, message: 'Something went wrong' };
        }
    }

    async savedPosts(data: string[]) {
        try {
            const result:any = await this.postRepo.savedPosts(data);

            if (!result && !result.data) {
                return { success: false, message: 'Unable to find the data' }
            }

            const postsWithImages = await Promise.all(result.data?.map(async (post:any) => {
                if (post.imageUrl && post.imageUrl.length > 0) {
                    const imageUrls = await Promise.all(post.imageUrl.map(async (imageKey:any) => {
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

            return { success: true, message: 'Images and user data sent', data: postsWithImages };
        } catch (error) {
            return { success: false, message: 'Something went wrong' };
        }
    }
}

export { PostService };