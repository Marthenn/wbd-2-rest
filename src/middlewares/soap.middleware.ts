import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import { SoapService } from "../services/soap.service";
import {UploadMiddleware} from "./upload.middleware";

import * as fs from "fs";
import * as path from "path";

// WARN: THIS IS A STUB CODE
export class SoapMiddleware {
    soapService: SoapService
    uploadMiddleware: UploadMiddleware

    constructor() {
        this.soapService = new SoapService();
        this.uploadMiddleware = new UploadMiddleware();
    }

    createRequest() {
        return async(req: Request, res: Response, next: NextFunction) => {
            // TODO: handle uploaded file and get the path
            // TODO: get the username and email from the request body
            this.uploadMiddleware.upload('image')(req, res, next);
            // const file = res.body.filename;
            const username = req.body.username;
            const email = req.body.email;

            const isCreated = await this.soapService.createRequest(
                // TODO: pass the username, email, and path to the service
                username, email, 'path'
            );
            if (!isCreated) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR
                })
            }
        }
    }

    


}
