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
            .get('/book/:page', (req, res) => {
                console.log("Handling /book/:page request");
                this.bookController.index()(req, res);
            })
            .get('/book/count', (req, res) => {
                console.log("Handling /book/count request");
                this.bookController.bookCount()(req, res);
            })
            .get('/book/:id', (req, res) => {
                console.log("Handling /book/:id request");
                this.bookController.bookDetails()(req, res);
            })
            .get('/book/:id/chapternames', (req, res) => {
                console.log("Handling /book/:id/chapternames request");
                this.bookController.chapterNames()(req, res);
            })
            .get('/book/:id/chapter', (req, res) => {
                console.log("Handling /book/:id/chapter request");
                this.bookController.chapterDetails()(req, res);
            })
            .get('/book/:id/chapter/:chapter_id', (req, res) => {
                console.log("Handling /book/:id/chapter/:chapter_id request");
                this.bookController.chapterDetails()(req, res);
            })
    }
}
