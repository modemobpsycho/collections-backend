import { Response, Request } from 'express';
import { prismaClient } from '../prisma/database';

export const getAllItems = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params;
        const items = await prismaClient.item.findMany({
            where: { collectionId: Number(collectionId) },
            orderBy: { id: 'asc' },
            include: {
                ItemFields: true,
                tags: true
            }
        });
        res.send(items);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getItem = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        const item = await prismaClient.item.findUnique({
            where: { id: Number(itemId) },
            include: {
                ItemFields: true,
                tags: true,
                comments: true,
                likes: true,
                collection: {
                    include: {
                        collectionFields: true
                    }
                }
            }
        });
        console.log(item);
        res.send(item);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const addItem = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params;
        const { name, tags, creationDate, ItemFields } = req.body;
        console.log(req.body);
        const item = await prismaClient.item.create({
            data: {
                name,
                creationDate,
                collectionId: Number(collectionId),
                tags: {
                    create: tags
                },
                ItemFields: {
                    create: ItemFields
                }
            },
            include: {
                ItemFields: true,
                tags: true
            }
        });
        res.send(item);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateItem = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        const { name, tags, creationDate, ItemFields } = req.body;

        const item = await prismaClient.item.update({
            where: { id: Number(itemId) },
            data: {
                name,
                creationDate,
                tags: {
                    deleteMany: {},
                    create: tags
                },
                ItemFields: {
                    deleteMany: {},
                    create: ItemFields
                }
            },
            include: {
                ItemFields: true,
                tags: true
            }
        });
        res.send(item);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        await prismaClient.item.delete({
            where: { id: Number(itemId) }
        });
        res.send('Item deleted successfully');
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
