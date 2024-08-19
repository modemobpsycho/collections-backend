import { Response, Request } from 'express';
import { MyConfig } from '../config/config';
import { prismaClient } from '../prisma/database';
import TokenService from '../service/tokenService';
import bcrypt from 'bcrypt';
import IUser from '../types/user.interface';
import IUserJwtPayload from '../types/userJwtPayload';
import { constants } from '../helpers/constants';
import { decode, JwtPayload } from 'jsonwebtoken';

const tokenService = new TokenService();
const salt = MyConfig.SALT;

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prismaClient.user.findMany({
            orderBy: { id: 'asc' }
        });
        res.send(users);
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, fullName, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, salt!);

        const payload: IUserJwtPayload = { fullName, email };
        const refreshToken = tokenService.generateRefreshToken(payload);

        const user = await prismaClient.user.create({
            data: {
                email,
                fullName,
                role: 0,
                access: true,
                refreshToken,
                password: hashedPassword,
                lastLogin: new Date(),
                joinDate: new Date()
            }
        });

        return res.status(201).json({ user });
    } catch (error: Error | any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error('Error during user creation:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, salt!);

        const user = await prismaClient.user.findUnique({
            where: { email, password: hashedPassword }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.access) {
            return res.status(403).json({ message: 'User account is blocked' });
        }

        const payload = { fullName: user.fullName, email: user.email };
        const accessToken = tokenService.generateAccessToken(payload);
        const refreshToken = tokenService.generateRefreshToken(payload);

        await prismaClient.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date(), refreshToken }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: constants.maxAgeCookie
        });

        return res.status(200).json(accessToken);
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { email, fullName, oldPassword, newPassword } = req.body;
        const { authorization } = req.headers;

        const oldPayload = decode(authorization?.slice(7) as string);

        if (!oldPayload) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prismaClient.user.findUnique({
            where: { email: (oldPayload as JwtPayload).email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, salt!);

        await prismaClient.user.update({
            where: { id: user.id },
            data: { fullName, email, password: hashedPassword }
        });

        const payload = { fullName: user.fullName, email: user.email };
        const accessToken = tokenService.generateAccessToken(payload);
        const refreshToken = tokenService.generateRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: constants.maxAgeCookie
        });

        return res.status(200).json(accessToken);
    } catch (error) {
        console.error('Error during user update:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateUserAdmin = async (req: Request, res: Response) => {
    try {
        const { id, email, fullName, role, password, access } = req.body;

        if (password.trim() === '') {
            await prismaClient.user.update({
                where: { id: id },
                data: { fullName, email, role, access }
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, salt!);
            await prismaClient.user.update({
                where: { id: id },
                data: { fullName, email, role, password: hashedPassword, access }
            });
        }

        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error during user update:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const payload = decode(authorization?.slice(7) as string);
        if (!payload) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prismaClient.user.findUnique({
            where: { email: (payload as JwtPayload).email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error during getting current user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (!req.body.id) {
            const { authorization } = req.headers;

            const payload = decode(authorization?.slice(7) as string);

            if (!payload) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const user = await prismaClient.user.findUnique({
                where: { email: (payload as JwtPayload).email }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await prismaClient.user.delete({
                where: { id: user.id }
            });
            res.send('User deleted successfully');
        } else if (req.body.id) {
            const { id } = req.body;
            await prismaClient.user.delete({
                where: { id: Number(id) }
            });
            res.send('User deleted successfully');
        }
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
