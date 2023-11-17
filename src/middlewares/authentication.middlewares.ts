import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { jwtConfig } from "../config/jwt.config";

export interface AuthToken {
    uid: number;
    isAdmin: boolean;
    username: string;
    profilePicDirectry: string;
    email: string;
}

export interface AuthRequest extends Request {
    token: AuthToken;
}

export class AuthenticationMiddleware {
    authenticate() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = req.header('Authorization')?.replace('Bearer ', '');
                if (!token) {
                    res.status(StatusCodes.UNAUTHORIZED).json({
                      message: ReasonPhrases.UNAUTHORIZED
                    })
                    return
                }

                (req as AuthRequest).token = jwt.verify(
                    token, jwtConfig.secret
                ) as AuthToken;

                next();
            } catch (error) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED
                })
            }
        }
    }
}