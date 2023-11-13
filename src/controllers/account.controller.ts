import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
    AuthToken, AuthRequest
} from "../middlewares/authentication.middlewares";
import { jwtConfig } from "../config/jwt.config";
import { Account } from "../models/account.model";

interface TokenRequest {
    username: string,
    password: string
}

export class AccountController {
    token() {
        return async (req: Request, res: Response) => {
            const { username, password }: TokenRequest = req.body;
            if (!username || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST
                })
                return
            }

            const account = await Account.createQueryBuilder('account')
                .select(['account.uid', 'account.password', 'account.isAdmin'])
                .where('account.username = :username', { username })
                .getOne()
            if (!account) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Invalid credentials"
                })
                return
            }

            const isMatch = await bcrypt.compare(password, account.password);
            if (!isMatch) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Invalid credentials"
                })
                return
            }

            const { uid, isAdmin } = account;
            const payload: AuthToken = {
                uid, isAdmin
            }
            const token = jwt.sign(payload, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn
            });

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                token
            })
        }
    }

    usernameExist(){
        // TODO: check if username exit
    }

    emailExist(){
        return async (req: Request, res: Response) => {
            try {
                const email = req.params.email
                const account = await Account.createQueryBuilder('account')
                    .select(['account.uid', 'account.email'])
                    .where('account.email = :email', { email })
                    .getOne()
                if (!account) {
                    res.status(StatusCodes.OK).json({
                        message: "Email not exist"
                    })
                } else {
                    res.status(StatusCodes.OK).json({
                        message: "Email exist with uid: " + account.uid
                    })
                }
            } catch (error : any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error.message
                })
            }
        }
    }
}
