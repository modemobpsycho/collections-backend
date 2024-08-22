import { Response, Request } from 'express';
import { prismaClient } from '../prisma/database';

export const setReaction = async (req: Request, res: Response) => {
    try {
        const { creationDate, isLike, AUTH_userId } = req.body;
        const { itemId } = req.params;

        const existingReaction = await prismaClient.reaction.findFirst({
            where: {
                userId: AUTH_userId,
                itemId: Number(itemId)
            }
        });

        if (existingReaction) {
            if ((existingReaction.isLike && isLike) || (!existingReaction.isLike && !isLike)) {
                await prismaClient.reaction.delete({
                    where: {
                        id: existingReaction.id
                    }
                });
                res.send({ message: 'Reaction removed' });
            } else {
                const updatedReaction = await prismaClient.reaction.update({
                    where: {
                        id: existingReaction.id
                    },
                    data: {
                        isLike,
                        creationDate
                    }
                });
                res.send(updatedReaction);
            }
        } else {
            const reaction = await prismaClient.reaction.create({
                data: {
                    userId: AUTH_userId,
                    isLike,
                    creationDate,
                    itemId: Number(itemId)
                }
            });
            res.send(reaction);
        }
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getUserReactions = async (req: Request, res: Response) => {
    try {
        const { AUTH_userId } = req.body;
        const { limit } = req.params;
        const reactions = await prismaClient.reaction.findMany({
            take: Number(limit),
            where: {
                userId: Number(AUTH_userId)
            },
            include: {
                item: true
            },
            orderBy: {
                creationDate: 'desc'
            }
        });
        res.send(reactions);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
