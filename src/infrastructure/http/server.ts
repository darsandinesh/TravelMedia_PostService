import express from 'express';
import { databaseConnection } from '../database/mongodb'
import RabbitMQClient from '../rabbitMQ/client';

const app = express();
app.use(express.json());

const startServer = async () => {
    try {
        await databaseConnection();
        await RabbitMQClient.initialize();
        app.listen(4002, () => console.log(`postService running on port 4002`))

    } catch (error) {
        console.log('post srevice running error -->', error);
    }

}

startServer();