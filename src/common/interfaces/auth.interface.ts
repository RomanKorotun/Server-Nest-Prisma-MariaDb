import { Request } from 'express';

export interface IJwtPayload {
  id: number;
  tokenIdentifier: string;
  iat: number;
  exp: number;
}

export interface ICustomRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
