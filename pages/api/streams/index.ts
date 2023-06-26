import { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/redis-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pinnedStreamsRes = await redis.get('pinned-streams');
    const pinnedStreams = JSON.parse(pinnedStreamsRes || '[]');
    res.status(200).json(pinnedStreams);
}

process.on('SIGTERM', () => {
    redis.disconnect();
});
