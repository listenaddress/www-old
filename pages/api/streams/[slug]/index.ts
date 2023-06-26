import { NextApiRequest, NextApiResponse } from 'next';
import { handleErrors } from '../../../../lib/errors';
import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!
});
const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { slug } = req.query;
    const streamRes = await redis.get(`${slug}`);
    if (streamRes) {
        const stream = JSON.parse(streamRes);
        return res.status(200).json(stream);
    }
    return handleErrors(res, new Error('Stream not found'));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return await getHandler(req, res);
    } else {
        return handleErrors(res, new Error('Method not allowed'));
    }
}

process.on('SIGTERM', () => {
    redis.disconnect();
});
