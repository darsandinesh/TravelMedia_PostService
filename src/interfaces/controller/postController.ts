import { PostService } from "../../application/use-case/post"
import { IAddPostData } from "../../domain/entities/IPost";

class PostController {

    private postService: PostService;

    constructor() {
        this.postService = new PostService();

    }

    async addpost(data: IAddPostData) {
        try {
            const result = await this.postService.addPost(data);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async editPost(data: IAddPostData) {
        try {
            const result = await this.postService.editPost(data);
            return result;
        } catch (error) {
            console.log('error in edit post-->', error);
            throw error;
        }
    }

    async deletePost(id: string) {
        try {
            const result = await this.postService.deletePost(id);
            return result;
        } catch (error) {
            console.log('error in delet post-->', error);
            throw error;
        }
    }

    async reportPost(data: { userId: string, postId: string, reason: string }) {
        try {
            const result = await this.postService.reportPost(data);
            return result;
        } catch (error) {
            console.log('error in delet post-->', error);
            throw error;
        }
    }

    async fetchedAllPosts(page: number) {
        try {
            console.log(page, '-------------------------hello')
            const result = await this.postService.getAllPosts(page)
            console.log(result, '-----------------------return in post controller');
            return result;
        } catch (error) {

        }
    }

    async fetchUserPosts(id: string) {
        try {
            console.log('id--------------------', id, '=========================')
            const result = await this.postService.fetchUserPosts(id)
            return result;
        } catch (error) {

        }
    }

    async getNewPosts() {
        try {
            const result = await this.postService.getNewPosts();
            return result;
        } catch (error) {

        }
    }

    async likePost(data: { logged: string, postId: string }) {
        try {
            console.log(data)
            const result = await this.postService.likePost(data);
            return result;
        } catch (error) {
            console.log('error in the likepost')
        }
    }

    async unlikePost(data: { logged: string, postId: string }) {
        try {
            console.log(data)
            const result = await this.postService.unlikePost(data);
            return result;
        } catch (error) {
            console.log('error in the likepost')
        }
    }

    async comment(data: any) {
        try {
            console.log(data)
            const result = await this.postService.comment(data);
            return result;
        } catch (error) {
            console.log('error in the comment post')
        }
    }

    async deleteComment(data: any) {
        try {
            console.log(data)
            const result = await this.postService.deleteComment(data);
            return result;
        } catch (error) {
            console.log('error in the comment post')
        }
    }

    async getPost(postId: string) {
        try {
            console.log(postId);
            const result = await this.postService.getPost(postId);
            return result;
        } catch (error) {
            console.log('error in getPost postController -->', error);
        }
    }

    // delete images from the post
    async deleteImage(data: { index: number, postId: string }) {
        try {
            const result = await this.postService.deleteImage(data);
            return result
        } catch (error) {

        }
    }

    // find buddy controller codes are written below

    async findBuddy(data: any) {
        try {
            console.log(data);
            const result = await this.postService.findBuddy(data);
            return result
        } catch (error) {
            console.log('error in the findbuddy', error);
        }
    }

    async getfindBuddy(page: number) {
        try {
            const result = await this.postService.getfindBuddy(page);
            return result;
        } catch (error) {

        }
    }
}

export const postController = new PostController();