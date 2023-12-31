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
import { SoapService } from "../services/soap.service";

interface TokenRequest {
    username: string,
    password: string
}

import * as fs from "fs";
import * as path from "path";

export class AccountController {
    soapService = new SoapService()

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
                acc.password = req.body.password;
                acc.email = req.body.email;
                acc.profilePicDirectory = req.body.profilePicDirectory;
                const accId = acc.save();
                if (!accId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: ReasonPhrases.BAD_REQUEST,
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                    });
                }
            } catch (error : any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR
                })
            }
        }
    }

    token() {
        return async (req: Request, res: Response) => {
            const usernameReq = req.body.username
            const password = req.body.password
            if (!usernameReq || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST
                })
                return
            }

            const account = await Account.createQueryBuilder('account')
                .select(['account.uid', 'account.password', 'account.isAdmin', 'account.username', 'account.profilePicDirectory', 'account.email'])
                .where('account.username = :username', { username: usernameReq })
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
            const username = account.username;
            const payload= {
                uid,
                isAdmin,
                username,
                profilePicDirectory,
                email: account.email
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

    createRequest(){
        return async(req: Request, res: Response) => {
            try{
                const username = req.body.username
                const email = req.body.email
                const filename = 'path';
                console.log(filename);
                //TODO: parse file

                const returnString = await this.soapService.createRequest(username,email,'path');

                console.log(returnString);

                // //TODO: handle the response (code belows are example only)
                if(returnString == 'A pending request already exists'){
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: 'A pending request already exists'
                    });
                } else if (returnString == 'Admin cannot create request'){
                    res.status(StatusCodes.UNAUTHORIZED).json({
                        message: 'Admin cannot create request'
                    });
                } else if (returnString == 'Account with the specified username already exists with different email'){
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: 'Account with the specified username already exists with different email'
                    });
                } else if (returnString == 'Account with the specified email already exists with different username'){
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: 'Account with the specified email already exists with different username'
                    });
                } else if (returnString == 'Request created successfully'){
                    res.status(StatusCodes.OK).json({
                        message: 'Request created successfully'
                    });
                } else if (returnString == 'Failed to create request'){
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: 'Failed to create request'
                    });
                }
            } catch (error:any){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error.message
                })
            }
        }
    }

    getRequest() {
        return async(req: Request, res: Response) => {
            try {
                const username = req.body.username;
                const requestData = await this.soapService.getRequest(username);
                res.status(StatusCodes.OK).json({
                    requestData
                });
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error.message
                })
            }
        }
    }

    getRequestPage() {
        return async(req: Request, res: Response) => {
            try {
                const username = req.body.username;
                const requestData = await this.soapService.getRequest(username);
                res.status(StatusCodes.OK).json({
                    requestData
                });
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error.message
                })
            }
        }
    }

    approveRequest() {
        return async(req: Request, res: Response) => {
            try {
                const username = req.body.username;
                const approveData = await this.soapService.getRequest(username);
                res.status(StatusCodes.OK).json({
                    approveData
                });
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error.message
                })
            }
        }
    }
    
    rejectRequest() {
        return async(req: Request, res: Response) => {
            try {
                const username = req.body.username;
                const rejectData = await this.soapService.getRequest(username);
                res.status(StatusCodes.OK).json({
                    rejectData
                });
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: error.message
                })
            }
        }
    }
}
