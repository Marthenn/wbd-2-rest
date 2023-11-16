import { Router } from 'express';

import { AuthenticationMiddleware } from "../middlewares/authentication.middlewares";
import { BookController } from '../controllers/book.controller';

export class BookRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    bookController: BookController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.bookController = new BookController();
    }

    getRoute() {
        console.log("Setting up /book route");
        return Router()
            .get('/book', (req, res) => {
                console.log("Handling /book request");
                this.bookController.index()(req, res);
            })
            .get('/book/count', (req, res) => {
                console.log("Handling /book request");
                this.bookController.bookCount()(req, res);
            })
            .get('/book/:id', (req, res) => {
                console.log("Handling /book/:id request");
                this.bookController.bookDetails()(req, res);
            })
    }
}
