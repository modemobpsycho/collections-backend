import { Response, Request } from 'express';
import { prismaClient } from '../prisma/database';

export const addComment = async (req: Request, res: Response) => {
    try {
        const { textComment, creationDate, AUTH_userId, AUTH_fullName } = req.body;
        const { itemId } = req.params;
        const comment = await prismaClient.comment.create({
            data: {
                textComment,
                creationDate,
                itemId: Number(itemId),
                userId: AUTH_userId,
                userFullname: AUTH_fullName
            }
        });
        res.send(comment);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.body;
        await prismaClient.comment.delete({
            where: { id: Number(commentId) }
        });
        res.send('Comment deleted successfully');
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getUserComments = async (req: Request, res: Response) => {
    try {
        const { AUTH_userId } = req.body;
        const { limit } = req.params;

        const comments = await prismaClient.comment.findMany({
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

        res.send(comments);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
