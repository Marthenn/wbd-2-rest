import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication.middlewares";
import { SoapService } from "../services/soap.service";
import { AccountController } from "../controllers/account.controller";
import { SoapMiddleware } from "../middlewares/soap.middleware";
import { UploadMiddleware } from "../middlewares/upload.middleware";

export class SoapRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    soapService: SoapService;
    soapMiddleware: SoapMiddleware;
    accountController: AccountController;
    uploadMiddleware: UploadMiddleware;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.soapService = new SoapService();
        this.soapMiddleware = new SoapMiddleware();
        this.accountController = new AccountController();
        this.uploadMiddleware = new UploadMiddleware();
    }

    getRoute() {
        return Router()
            .post("/membership/request",
                // this.authenticationMiddleware.authenticate(),
                // this.uploadMiddleware.upload("image"),
                this.accountController.createRequest(),
            )
            .post("/membership/request",
                // this.authenticationMiddleware.authenticate(),
                this.accountController.getRequest()
            )
            .post("/membership/request/approval",
                // this.authenticationMiddleware.authenticate(),
                this.accountController.approveRequest()
            )
            .post("/membership/request/disapproval",
                // this.authenticationMiddleware.authenticate(),
                this.accountController.rejectRequest()
            )
            .post("/membership/request/25",
                // this.authenticationMiddleware.authenticate(),
                this.accountController.getRequestPage()            
            )
    }
}