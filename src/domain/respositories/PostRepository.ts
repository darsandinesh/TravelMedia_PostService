import mongoose from "mongoose";
import { Post } from "../../model/PostModel";
import { TravelBuddy } from '../../model/BuddyModel'
import { IPost, ISavePostData } from "../entities/IPost";
import { IPostRepository } from "./IPostRepository";
import { databaseConnection } from "../../infrastructure/database/mongodb";

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

    async edit(post: any): Promise<{ success: boolean; message: string; data?: any }> {
        try {

            console.log('edit 1')
            console.log(post)
            // Update the post with new description, location, and image URLs
            const update = await Post.updateOne(
                { _id: post.postId },
                {
                    $set: {
                        description: post.description,
                        location: post.location,
                    },
                    $push: {
                        imageUrl: { $each: post.imageUrl }, // Use $push with $each to add multiple images
                    },
                }
            );

            console.log(update)

            if (update.modifiedCount === 0) {
                return { success: false, message: 'Unable to update post: No changes made or post not found' };
            }

            return { success: true, message: 'Post updated successfully', data: update };

        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error while updating post:', error);

            return { success: false, message: 'Unable to update the post due to server error' };
        }
    }

    async deletPost(id: string) {
        try {

            let res = await Post.updateOne({ _id: id }, { $set: { isDelete: true } });
            console.log(res);
            return res
        } catch (error) {
            console.error('Error while updating post:', error);

            return { success: false, message: 'Unable to detete the post due to server error' };
        }
    }

    async reportPost(data: { userId: string, postId: string, reason: string }) {
        try {
            console.log(data);

            const reportData = {
                UserId: data.userId,
                reason: data.reason,
                status: 'pending',
                reportDate: new Date()
            }

            const updatePost = await Post.findByIdAndUpdate(
                data.postId,
                {
                    $push: {
                        reportPost: reportData
                    }
                },
                { new: true }
            )

            if (updatePost) {
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }


    async findAllPost(page: number): Promise<{ success: boolean, message: string, count?: number, data?: IPost[] }> {
        try {
            const posts = await Post.find({ isDelete: false }).sort({ created_at: -1 }).skip((page-1) * 6).limit(page * 6);
            const totalPosts = await Post.countDocuments({ isDelete: false });
            if (!posts) {
                return { success: false, message: "no posts found" };
            }
            return { success: true, message: "post found", data: posts, count: totalPosts };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching all post", err);
            throw new Error(`Error fetching post: ${err.message}`);
        }
    }

    async fetchReportPosts(page: number): Promise<{ success: boolean, message: string, count?: number, data?: IPost[] }> {
        try {
            const posts = await Post.find({
                isDelete: false,
                reportPost: { $exists: true, $not: { $size: 0 } }
            })
                .sort({ created_at: -1 })
                .limit(page * 5);

            const totalReportedPosts = await Post.countDocuments({
                isDelete: false,
                reportPost: { $exists: true, $not: { $size: 0 } }
            });

            console.log(posts, '-----------in repor posts')
            if (!posts) {
                return { success: false, message: "no posts found" };
            }
            return { success: true, message: "post found", data: posts, count: totalReportedPosts };
        } catch (error) {
            const err = error as Error;
            console.log("Error fetching reported post", err);
            throw new Error(`Error fetching reported post: ${err.message}`);
        }
    }

    async findUserPost(id: String): Promise<{ success: boolean, message: string, data?: IPost[] }> {
        try {

            const posts = await Post.find({ userId: id, isDelete: false }).sort({ created_at: -1 });
            console.log(posts, '----post data');
            if (!posts || posts.length === 0) {
                return { success: true, message: "No posts found" };
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

    async likePost(data: { logged: string, postId: string }) {
        try {
            if (!data.logged || !data.postId) {
                return false;
            }

            const post = await Post.updateOne(
                { _id: data.postId },
                { $addToSet: { likes: { UserId: data.logged } } }
            )
            console.log(post)
            return post;
        } catch (error) {
            console.log('error in likepost in postRepo', error);
            return null
        }
    }

    async unlikePost(data: { logged: string, postId: string }) {
        try {
            if (!data.logged || !data.postId) {
                return false;
            }

            const post = await Post.updateOne(
                { _id: data.postId },
                { $pull: { likes: { UserId: data.logged } } }
            )
            console.log(post)
            return post;
        } catch (error) {
            console.log('error in likepost in postRepo', error);
            return null
        }
    }

    async comment(data: {
        content: string,
        postId: string,
        userId: string,
        avatar: string,
        userName: string,
        parentCommentId?: string
        replayText?: string,
    }) {
        try {
            // Basic validation
            if (!data.postId || !data.userId) {
                return false;
            }

            if (data.parentCommentId) {
                // Handle replying to an existing comment
                const post = await Post.updateOne(
                    { _id: data.postId, 'comments._id': data.parentCommentId },
                    {
                        $addToSet: {
                            'comments.$.replies': { // Accessing the 'replies' field of the specific comment
                                UserId: data.userId,
                                content: data.replayText,
                                userName: data.userName,
                                avatar: data.avatar
                            }
                        }
                    }
                );
                console.log(post);
                return post;
            } else {
                // Handle adding a new comment
                const post = await Post.updateOne(
                    { _id: data.postId },
                    {
                        $addToSet: {
                            comments: {
                                UserId: data.userId,
                                content: data.content,
                                userName: data.userName,
                                avatar: data.avatar
                            }
                        }
                    }
                );
                console.log(post);
                return post;
            }
        } catch (error) {
            console.log('error in comment method', error);
            return null;
        }
    }

    async deleteComment(data: {
        postId: string,
        commentId: string,
        userId?: string,
        parentCommentId?: string
    }) {
        try {
            if (!data.postId || !data.commentId || !data.userId) {
                throw new Error('Invalid data');
            }

            let post;

            if (data.parentCommentId) {
                // Deleting a reply from a comment
                post = await Post.updateOne(
                    {
                        _id: data.postId,
                        'comments._id': data.parentCommentId,
                        'comments.replies._id': data.commentId, // Find the specific reply
                        'comments.replies.UserId': data.userId  // Make sure the user is the owner of the reply
                    },
                    {
                        $pull: {
                            'comments.$.replies': { _id: data.commentId } // Delete the reply
                        }
                    }
                );
            } else {
                // Deleting a top-level comment
                post = await Post.updateOne(
                    {
                        _id: data.postId,
                        'comments._id': data.commentId,
                        'comments.UserId': data.userId // Make sure the user is the owner of the comment
                    },
                    {
                        $pull: {
                            comments: { _id: data.commentId } // Delete the comment
                        }
                    }
                );
            }

            if (post.modifiedCount === 0) {
                throw new Error('Comment or reply not found or not authorized to delete');
            }

            return post;
        } catch (error) {
            console.log('Error in deleteComment method:', error);
            return null;
        }
    }


    async getPost(id: string): Promise<{ success: boolean, message: string, data?: any }> {
        try {
            if (!id) {
                return { success: false, message: 'No postId found' };
            }

            const posts = await Post.findById(id);

            if (!posts) {
                return { success: false, message: 'No postId found' };
            }

            return { success: true, message: 'data found', data: posts }

        } catch (error) {
            console.log("Error to fetch single post ->", error);
            return { success: false, message: 'something went wrong' };
        }
    }

    async deleteImage(data: { index: number, postId: string }) {
        try {
            const images = await Post.findOne({ _id: data.postId })
            const imageKey = images?.imageUrl[data.index];

            const update = await Post.updateOne({ _id: data.postId }, {
                $pull: { imageUrl: imageKey }
            })

            return { success: true, res: update }
        } catch (error) {
            console.log("Error to fetch single post ->", error);
            return { success: false, message: 'something went wrong' };
        }
    }

    async savedPosts(data: string[]) {
        try {
            console.log(data, '----------data')
            const posts = await Post.find({
                _id: { $in: data },
                isDelete: false
            }).sort({ created_at: -1 });

            console.log(posts, '----post data');

            if (!posts || posts.length === 0) {
                return { success: true, message: "No posts found" };
            }

            return { success: true, message: "Posts found", data: posts };
        } catch (error) {
            console.error("Error fetching posts:", error);
            return { success: false, message: "An error occurred while fetching posts" };
        }
    }

    async searchPost(data: { searchTerm: string; filter: string }) {
        try {
            console.log(data, '------om repo')
            const searchRegex = new RegExp(data.searchTerm, 'i');
            const query: any = {
                isDelete: false,
            };

            if (data.filter === 'description') {
                console.log('if')
                query.description = searchRegex;
            } else if (data.filter === 'location') {
                console.log('else if')
                query.location = searchRegex;
            } else {
                console.log('else')
                query.$or = [
                    { description: searchRegex },
                    { location: searchRegex },
                ];
            }
            console.log(query, 'q')
            const posts = await Post.find(query);
            return posts;
        } catch (error) {
            console.log("Error in searchPost in postRepo:", error);
            return null
        }
    }


    async saveFindBuddy(data: any) {
        try {
            console.log('sdjfadsl')
            console.log(data);
            const newPost = new TravelBuddy({
                userId: data.userId,
                travelDate: data.travelDate,
                travelType: data.travelType,
                location: data.location,
                description: data.description,
                maxParticipants: data.maxParticipants,
                isPrivate: data.isPrivate,
                travelDuration: data.travelDuration,
                preferences: {
                    budget: data.preferences.budget,
                    accommodation: data.preferences.accommodation,
                    transportMode: data.preferences.transportMode
                },
                mediaUrls: data.mediaUrls
            })
            const savedPost = await newPost.save();
            if (!savedPost) {
                return { success: false, message: "Can't save the trip " }
            }
            return { success: true, message: "Saved successful", data: savedPost }
        } catch (error) {

        }
    }

    async getfindBuddy(page: number) {
        try {
            const posts = await TravelBuddy.find({ isDeleted: false }).sort({ created_at: -1 }).limit(page * 5)
            if (!posts) {
                return { success: false, message: "no posts found" };

            }
            return { success: true, message: "post found", data: posts };
        } catch (error) {
            console.log(error);
            return { success: false }
        }
    }

}

