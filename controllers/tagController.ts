import { Response, Request } from 'express';
import { prismaClient } from '../prisma/database';

export const getTags = async (req: Request, res: Response) => {
    try {
        const { contain, limit } = req.params;

        if (!/^[a-zA-Z0-9]+$/.test(contain)) {
            return res.json([]);
        }

        const tags = await prismaClient.tag.findMany({
            where: {
                tag: {
                    contains: contain,
                    mode: 'insensitive'
                }
            },
            take: Number(limit)
        });

        res.json(tags);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getLastTags = async (req: Request, res: Response) => {
    try {
        const limit = req.params.limit;
        const lastTags = await prismaClient.tag.findMany({
            take: Number(limit),
            orderBy: {
                id: 'desc'
            }
        });
        res.json(lastTags);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
