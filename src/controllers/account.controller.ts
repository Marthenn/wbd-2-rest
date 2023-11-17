import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
    AuthToken, AuthRequest
} from "../middlewares/authentication.middlewares";
import { jwtConfig } from "../config/jwt.config";
import { Account } from "../models/account.model";
import {bcryptConfig} from "../config/bcrypt.config";

interface TokenRequest {
    username: string,
    password: string
}

import * as fs from "fs";
import * as path from "path";

export class AccountController {
    accountDetails() {
        return async (req: Request, res: Response) => {
            try {
                const acc = await Account.createQueryBuilder('account')
                    .select(['account.uid', 'account.username', 'account.email', 'account.joinedDate', 'account.expiredDate', 'account.isAdmin', 'account.profilePicDirectory'])
                    .where('account.uid = :uid', { uid: parseInt(req.params.uid) })
                    .getOne();
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                    account: acc
                });
                console.log(acc);
            } catch (error : any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR
                })
            }
        }
    }

    updateAccountDetails() {
        return async (req: Request, res: Response) => {
            try {
                const acc = await Account.createQueryBuilder('account')
                    .select(['account.uid', 'account.username', 'account.email', 'account.joinedDate', 'account.expiredDate', 'account.isAdmin', 'account.profilePicDirectory'])
                    .where('account.uid = :uid', { uid: parseInt(req.params.uid) })
                    .getOne();
                // TODO: Check file
                const oldFilename = acc.profilePicDirectory;
                fs.unlinkSync(path.join(__dirname, `../../public/image/${oldFilename}`));
                acc.username = req.body.username;
                acc.email = req.body.email;
                acc.profilePicDirectory = req.body.profilePicDirectory;
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                });
            } catch (error : any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR
                })
            }
        }
    }

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
                .select(['account.uid', 'account.password', 'account.isAdmin', 'account.username', 'account.profilePicDirectory'])
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

            const { uid, isAdmin, profilePicDirectory } = account;
            const usernameNew = account.username;
            const payload= {
                uid,
                isAdmin,
                usernameNew,
                profilePicDirectory
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
        return async (req: Request, res: Response) => {
            try {
                const username = req.params.username
                const account = await Account.createQueryBuilder('account')
                    .select(['account.uid', 'account.username'])
                    .where('account.username = :username', { username })
                    .getOne()
                if (!account) {
                    res.status(StatusCodes.OK).json({
                        message: true
                    })
                } else {
                    res.status(StatusCodes.OK).json({
                        message: false
                    })
                }
            } catch (error : any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error.message
                })
            }
        }
    }

    emailExist(){
        return async (req: Request, res: Response) => {
            try {
                const email = req.params.email
                const account = await Account.createQueryBuilder('account')
                    .select(['account.uid', 'account.email'])
                    .where('account.email = :email', { email })
                    .getOne()
                if (account === null) {
                    res.status(StatusCodes.OK).json({
                        message: false
                    })
                } else {
                    res.status(StatusCodes.OK).json({
                        message: true
                    })
                }
            } catch (error : any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error.message
                })
            }
        }
    }

    createAccount(){
        return async (req: Request, res: Response) => {
            try {
                // parse the request body
                const username = req.body.username
                const email = req.body.email
                const password = req.body.password

                // check if the username and email already exist
                const usernameExist = await Account.createQueryBuilder('account')
                    .select(['account.uid', 'account.username'])
                    .where('account.username = :username', { username })
                    .getOne()
                if (usernameExist) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Username already exist"
                    })
                    return
                }

                const emailExist = await Account.createQueryBuilder('account')
                    .select(['account.uid', 'account.email'])
                    .where('account.email = :email', { email })
                    .getOne()
                if (emailExist) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: "Email already exist"
                    })
                    return
                }

                // // hash the password
                // const salt = await bcrypt.genSalt(bcryptConfig.SaltRounds);
                // const hashedPassword = await bcrypt.hash(password, salt);

                // create the account
                const account = new Account();
                account.username = username
                account.email = email
                account.password = password
                account.isAdmin = false
                account.joinedDate = new Date()

                // save the account
                await account.save()

                // return the account
                res.status(StatusCodes.OK).json({
                    message: "Account created successfully",
                })
            } catch (error : any){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error.message
                })
            }
        }
    }
}
