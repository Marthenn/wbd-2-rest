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
                console.log("Handling /book/details/:book_id/chapter/:chapter_id GET request");
                this.bookController.chapterDetails()(req, res);
            })
            .get('/book/details/:book_id/chapternames', (req, res) => {
                console.log("Handling /book/details/:book_id/chapternames GET request");
                this.bookController.chapterNames()(req, res);
            })
            .get('/book/details/:book_id?', (req, res) => {
                console.log("Handling /book/details/:book_id GET request");
                this.bookController.bookDetails()(req, res);
            })
            .get('/book/count/:filter?', (req, res) => {
                console.log("Handling /book/count/filter? GET request");
                this.bookController.bookCount()(req, res);
            })
            .get('/book/:page?/:filter?', (req, res) => {
                console.log("Handling /book/:filter/:page GET request");
                this.bookController.index()(req, res);
            })
            .post('/favoritebook/:uid/:book_id', (req, res) => {
                console.log("Handling /book/details/:book_id POST request");
                this.bookController.addFavoriteBook()(req, res);
            })
            .delete('/favoritebook/:uid/:book_id', (req, res) => {
                console.log("Handling /book/details/:book_id DELETE request");
                this.bookController.deleteFavoriteBook()(req, res);
            })
            .get('/favoritebook/count/:uid/:filter?', (req, res) => {
                console.log("Handling /favoritebook/count/:uid/:filter? GET request");
                console.log(req.params);
                this.bookController.favoriteBookCount()(req, res);
            })
            .get('/favoritebook/:uid/:page?/:filter?', (req, res) => {
                console.log("Handling /favoritebook/:uid/:filter/:page GET request");
                this.bookController.favoriteBookList()(req, res);
            })
    }
}
