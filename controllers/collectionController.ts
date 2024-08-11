import { Response, Request } from 'express';
import { MyConfig } from '../config/config';
import { prismaClient } from '../prisma/database';
import { decode, JwtPayload } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const photoPath = MyConfig.PHOTO_PATH;

export const getCollections = async (req: Request, res: Response) => {
    try {
        const collections = await prismaClient.collection.findMany({
            orderBy: { id: 'asc' }
        });
        res.send(collections);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const createCollection = async (req: Request, res: Response) => {
    try {
        const {} = req.body;
        // const { authorization } = req.headers;
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

        console.log(postedFile);

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
        console.log(postedFile);

        stream.write(postedFile.buffer);
        stream.end();

        return res.status(200).json(`${userId}/${newFileName}`);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
};
