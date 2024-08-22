import { Response, Request } from 'express';
import { MyConfig } from '../config/config';
import { prismaClient } from '../prisma/database';
import { decode, JwtPayload } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const photoPath = MyConfig.PHOTO_PATH;

export const getAllCollections = async (req: Request, res: Response) => {
    try {
        const { limit } = req.params;

        const collections = await prismaClient.collection.findMany({
            take: Number(limit),
            orderBy: { id: 'asc' },
            include: {
                user: true,
                collectionFields: true,
                items: {
                    include: {
                        likes: true
                    }
                }
            }
        });
        res.send(collections);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getMyCollections = async (req: Request, res: Response) => {
    try {
        const { AUTH_userId } = req.body;
        const collections = await prismaClient.collection.findMany({
            where: { userId: AUTH_userId },
            orderBy: { id: 'asc' },
            include: {
                collectionFields: true,
                items: {
                    include: {
                        likes: true
                    }
                }
            }
        });
        res.send(collections);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getCollectionInfo = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params;
        const collection = await prismaClient.collection.findUnique({
            where: { id: Number(collectionId) },
            include: {
                collectionFields: true,
                items: {
                    include: {
                        likes: true,
                        ItemFields: true,
                        tags: true,
                        comments: true
                    }
                },
                user: true
            }
        });
        res.send(collection);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const changeCollectionInfo = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params;
        const { title, description, theme, photoPath } = req.body;
        await prismaClient.collection.update({
            where: { id: Number(collectionId) },
            data: {
                title,
                description,
                theme,
                photoPath
            }
        });
        res.send('Collection info changed successfully');
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const deleteCollection = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params;
        await prismaClient.collection.delete({
            where: { id: Number(collectionId) }
        });
        res.send('Collection deleted successfully');
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const createCollection = async (req: Request, res: Response) => {
    try {
        const { title, description, theme, photoPath, items, collectionFields, AUTH_userId } =
            req.body;

        await prismaClient.collection.create({
            data: {
                title,
                description,
                theme,
                photoPath,
                creationDate: new Date(),
                userId: AUTH_userId,
                collectionFields: {
                    create: collectionFields
                }
            },
            include: {
                collectionFields: true
            }
        });

        res.status(201).json('Collection created successfully');
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const saveCollectionPhoto = async (req: Request, res: Response) => {
    const { authorization } = req.headers;

    const decodedToken = decode(authorization?.slice(7) as string) as JwtPayload;

    const userId = (await prismaClient.user.findUnique({ where: { email: decodedToken.email } }))
        ?.id;

    if (!userId) {
        return res.status(400).json('default.jpg');
    }

    try {
        const postedFile = (req as any).file as Express.Multer.File;

        if (!postedFile) {
            return res.status(400).json('No files uploaded');
        }

        const fileName = postedFile.originalname;

        const physicalPath = path.join(__dirname, '..', photoPath as string, String(userId));
        if (!fs.existsSync(physicalPath)) {
            fs.mkdirSync(physicalPath, { recursive: true });
        }

        let newFilePath = path.join(physicalPath, fileName);
        let newFileName = fileName;
        let filesNum = 1;

        while (true) {
            if (fs.existsSync(newFilePath)) {
                newFilePath = path.join(
                    physicalPath,
                    `${fileName.slice(0, -4)} (${filesNum})${fileName.slice(-4)}`
                );
                newFileName = `${fileName.slice(0, -4)} (${filesNum})${fileName.slice(-4)}`;
                filesNum++;
            } else {
                break;
            }
        }

        const stream = fs.createWriteStream(newFilePath);

        stream.write(postedFile.buffer);
        stream.end();

        return res.status(200).json(`${userId}/${newFileName}`);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
};

export const getBiggestCollectionsByItems = async (req: Request, res: Response) => {
    try {
        const collections = await prismaClient.collection.findMany({
            include: {
                user: true,
                items: {
                    include: {
                        likes: true
                    }
                }
            },
            orderBy: {
                items: {
                    _count: 'desc'
                }
            },
            take: 6
        });
        res.send(collections);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
