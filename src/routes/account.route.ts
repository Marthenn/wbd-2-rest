import { Router } from 'express';

import { AuthenticationMiddleware } from "../middlewares/authentication.middlewares";
import { AccountController } from "../controllers/account.controller";
import { UploadMiddleware } from '../middlewares/upload.middleware';

export class AccountRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    accountController: AccountController;
    uploadMiddleware: UploadMiddleware;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.accountController = new AccountController();
        this.uploadMiddleware = new UploadMiddleware();
    }

    getRoute() {
        return Router()
            .get('/account/details/:uid',
                (req, res) => {
                    console.log("Handling /account/details/:uid GET request");
                    this.accountController.accountDetails()(req, res);
                })
            .put('/account/details/:uid',
                // TODO: check file
                    this.uploadMiddleware.upload('image'),
                    this.accountController.updateAccountDetails()
                )
            .post('/account/token', this.accountController.token())
            .get('/account/emailExists/:email', this.accountController.emailExist())
            .post('/account/create', this.accountController.createAccount())
    }
}