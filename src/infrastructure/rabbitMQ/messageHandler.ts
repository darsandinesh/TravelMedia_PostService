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
            case 'get-all-posts':
                console.log('Post Service - operation', operation);
                response = await postController.fetchedAllPosts(data);
                break;
            case 'get-user-posts':
                console.log('Post Service - operation', operation);
                response = await postController.fetchUserPosts(data)
                break;
            case 'getNewPosts':
                console.log('Post Service - operation : ',operation);
                response = await postController.getNewPosts();
                break;
            default:
                response = { error: 'Operation not found' };
                break;
        }
        console.log('produce message : ', response, replyTo, correlationId);

        await RabbitMQClient.produce(response, correlationId, replyTo)
    }
}