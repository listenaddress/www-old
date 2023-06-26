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
    const streamActionRes = await redis.get(`${slug}/actions`);
    if (streamActionRes) {
        const stream = JSON.parse(streamActionRes);
        return res.status(200).json(stream);
    }
    return handleErrors(res, new Error('Stream actions not found'));
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { slug } = req.query;
        const { type, contentId } = req.body;
        const action = { type, contentId };
        const streamActionRes = await redis.get(`${slug}/actions`);
        if (streamActionRes) {
            const stream = JSON.parse(streamActionRes);
            stream.push(action);
            await redis.set(`${slug}/actions`, JSON.stringify(stream));
            return res.status(200).json(stream);
        } else {
            await redis.set(`${slug}/actions`, JSON.stringify([action]));
            return res.status(200).json([action]);
        }
    } catch (e) {
        return handleErrors(res, e);
    }
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { slug } = req.query;
        const streamActionRes = await redis.get(`${slug}/actions`);
        if (streamActionRes) {
            const actions = JSON.parse(streamActionRes);
            actions.pop();
            await redis.set(`${slug}/actions`, JSON.stringify(actions));
            return res.status(200).json(actions);
        } else {
            return handleErrors(res, new Error('Stream actions not found'));
        }
    } catch (e) {
        return handleErrors(res, e);
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return await getHandler(req, res);
    } else if (req.method === 'POST') {
        return await postHandler(req, res);
    } else if (req.method === 'DELETE') {
        return await deleteHandler(req, res);
    } else {
        return handleErrors(res, new Error('Method not allowed'));
    }
}

process.on('SIGTERM', () => {
    redis.disconnect();
});
