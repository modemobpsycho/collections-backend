import { Response, Request } from 'express';
import { prismaClient } from '../prisma/database';
import { Prisma } from '@prisma/client';

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
                comments: {
                    orderBy: { creationDate: 'asc' }
                },
                likes: true,
                collection: {
                    include: {
                        collectionFields: true
                    }
                }
            }
        });
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
                    deleteMany: { itemId: Number(itemId) },
                    createMany: {
                        data: ItemFields
                    }
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
        await prismaClient.tag.deleteMany({
            where: { itemId: Number(itemId) }
        });
        await prismaClient.item.delete({
            where: { id: Number(itemId) }
        });
        res.send('Item deleted successfully');
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getLastItems = async (req: Request, res: Response) => {
    try {
        const limit = req.params.limit;
        const lastItems = await prismaClient.item.findMany({
            take: Number(limit),
            orderBy: {
                creationDate: 'desc'
            },
            include: {
                comments: true,
                likes: true,
                collection: true
            }
        });
        res.json(lastItems);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const searchItems = async (req: Request, res: Response) => {
    try {
        const { contain, limit } = req.params;
        const items = await prismaClient.item.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: contain,
                            mode: 'insensitive'
                        }
                    },
                    {
                        tags: {
                            some: {
                                tag: {
                                    contains: contain,
                                    mode: 'insensitive'
                                }
                            }
                        }
                    },
                    {
                        collection: {
                            title: {
                                contains: contain,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
            include: {
                ItemFields: true,
                tags: true,
                likes: true,
                collection: true,
                comments: true
            },
            take: Number(limit)
        });
        res.send(items);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
