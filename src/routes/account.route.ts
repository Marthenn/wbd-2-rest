import { Router } from 'express';

import { AuthenticationMiddleware } from "../middlewares/authentication.middlewares";
import { AccountController } from "../controllers/account.controller";

export class AccountRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    accountController: AccountController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.accountController = new AccountController();
    }

    getRoute() {
        return Router()
            .post('/account/token', this.accountController.token())
            .get('/account/emailExists/:email', this.accountController.emailExist())
            .post('/account/create', this.accountController.createAccount())
    }
}