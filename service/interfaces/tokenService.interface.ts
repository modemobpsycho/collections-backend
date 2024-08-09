import { JwtPayload } from 'jsonwebtoken';
import UserJwtPayload from '../../types/userJwtPayload';

export interface ITokenService {
    validateAccessToken(token: string): string | JwtPayload | null;
    validateRefreshToken(token: string): string | JwtPayload | null;
}
