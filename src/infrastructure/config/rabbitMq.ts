import config from './config';

interface RabbitMqConfig {
    rabbitMQ: {
        url: string;
        queues: {
            postQueue:'post_queue'
        };
    };
}

const rabbitMQConfig: RabbitMqConfig = {
    rabbitMQ: {
        url: config.rabbitMq_url,
        queues: {
            postQueue:'post_queue'
        }
    }
}

export default rabbitMQConfig;