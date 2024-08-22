import { decode, JwtPayload } from 'jsonwebtoken';
import { prismaClient } from '../prisma/database';
import { NextFunction, Request, Response } from 'express';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send('Unauthorized');
    }

    const decodedToken = decode(authorization?.slice(7) as string) as JwtPayload;

    if (!decodedToken) {
        return res.status(401).send('Unauthorized');
    }

    const userId = (await prismaClient.user.findUnique({ where: { email: decodedToken.email } }))
        ?.id;

    if (!userId) {
        return res.status(400).send('Bad Request');
    }

    req.body.AUTH_userId = userId;
    req.body.AUTH_email = decodedToken.email;
    req.body.AUTH_fullName = decodedToken.fullName;

    next();
};
