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
            .get('/book/details/:book_id/chapter/:chapter_id?', (req, res) => {
                console.log("Handling /book/details/:book_id/chapter/:chapter_id request");
                this.bookController.chapterDetails()(req, res);
            })
            .get('/book/details/:book_id?', (req, res) => {
                console.log("Handling /book/details/:book_id request");
                this.bookController.bookDetails()(req, res);
            })
            .get('/book/count/:filter?', (req, res) => {
                console.log("Handling /book/count/filter? request");
                this.bookController.bookCount()(req, res);
            })
            .get('/book/:page?/:filter?', (req, res) => {
                console.log("Handling /book/:filter/:page request");
                this.bookController.index()(req, res);
            })
            .get('/favoritebook/count/:uid/:filter?', (req, res) => {
                console.log("Handling /favoritebook/count/:uid/:filter? request");
                console.log(req.params);
                this.bookController.favoriteBookCount()(req, res);
            })
            .get('/favoritebook/:uid/:page?/:filter?', (req, res) => {
                console.log("Handling /favoritebook/:uid/:filter/:page request");
                this.bookController.favoriteBookList()(req, res);
            })
    }
}
