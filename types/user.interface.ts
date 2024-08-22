export default interface IUser {
    id: number;
    email: string;
    fullName: string;
    role: number;
    access: boolean;
    refreshToken: string;
    password: string;
    lastLogin: Date;
    joinDate: Date;
}

export default interface IUserLoginInfo {
    email: string;
    password: string;
}

export interface IUserRegisterInfo {
    email: string;
    saltedPassword: string;
    fullName: string;
}

export interface IUserUpdateInfo {
    email: string;
    fullName: string;
    oldPassword: string;
    newPassword: string;
}
