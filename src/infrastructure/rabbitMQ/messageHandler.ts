import { postController } from "../../interfaces/controller/postController";
import rabbitMQConfig from "../config/rabbitMq";
import RabbitMQClient from './client';

export default class MessageHandler {
    static async handle(operation: string, data: any, correlationId: string, replyTo: string) {
        let response;

        switch (operation) {
            case 'create-post':
                console.log('Post Service - operation', operation);
                response = await postController.addpost(data);
                break;
            case "edit-post":
                console.log('Post Service - operation', operation);
                response = await postController.editPost(data);
                break;
            case 'deletePost':
                console.log('Post Service -operation', operation);
                response = await postController.deletePost(data);
                break;
            case 'reportPost':
                console.log('Post Service -operation', operation);
                response = await postController.reportPost(data);
                break;
            case 'findBuddy':
                console.log('Post Service -operation', operation);
                response = await postController.findBuddy(data);
                break
            case 'getfindBuddy':
                console.log('Post Service -operation', operation);
                response = await postController.getfindBuddy(data);
                break
            case 'get-all-posts':
                console.log('Post Service - operation', operation);
                response = await postController.fetchedAllPosts(data);
                break;
            case 'get-user-posts':
                console.log('Post Service - operation', operation);
                response = await postController.fetchUserPosts(data)
                break;
            case 'getNewPosts':
                console.log('Post Service - operation : ', operation);
                response = await postController.getNewPosts();
                break;
            case 'likePost':
                console.log('post service - operation ', operation);
                response = await postController.likePost(data);
                break;
            case 'unlikePost':
                console.log('post service - operation ', operation);
                response = await postController.unlikePost(data);
                break;
            case 'comment':
                console.log('post service - operation :', operation);
                response = await postController.comment(data);
                break;
            case 'deletComment':
                console.log('post service - operation :', operation);
                response = await postController.deleteComment(data);
                break;
            case 'getPost':
                console.log('post service - operation', operation);
                response = await postController.getPost(data);
                break;
            case 'deleteImage':
                console.log('POst service - operation :',operation);
                response = await postController.deleteImage(data);
                break;
            case 'getSavedPosts':
                console.log('post service - operation :',operation);
                response = await postController.savedPosts(data);
                break;
            default:
                response = { error: 'Operation not found' };
                break;
        }
        console.log('produce message : ', response, replyTo, correlationId);

        await RabbitMQClient.produce(response, correlationId, replyTo)
    }
}