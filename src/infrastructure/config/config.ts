import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: parseInt(process.env.PORT as string) || 5002,
    dbURI: process.env.DB_URI || '',
    rabbitMq_url: process.env.RABBITMQ_URL || '',
    bucketAccessKey: process.env.S3_ACCESS_KEY,
    bucketAccessPassword: process.env.S3_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKETNAME,
    bucketRegion: process.env.S3_BUCKET_REGION
}

export default config