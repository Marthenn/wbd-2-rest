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
            }) // get chapter details
            .get('/book/details/:book_id/chapternames', (req, res) => {
                console.log("Handling /book/details/:book_id/chapternames GET request");
                this.bookController.chapterNames()(req, res);
            }) // get chapter names and ids
            .get('/book/details/:book_id?', (req, res) => {
                console.log("Handling /book/details/:book_id GET request");
                this.bookController.bookDetails()(req, res);
            }) // get book details
            .get('/book/rating/:uid/:book_id', (req, res) => {
                console.log("Handling /book/rating/:uid/:book_id GET request");
                this.bookController.ratingStatus()(req, res);
            }) // get rating status
            .get('/book/count/:filter?', (req, res) => {
                console.log("Handling /book/count/filter? GET request");
                this.bookController.bookCount()(req, res);
            }) // get book count
            .get('/book/:page?/:filter?', (req, res) => {
                console.log("Handling /book/:filter/:page GET request");
                this.bookController.index()(req, res);
            }) // get book list
            .post('/favoritebook/:uid/:book_id', (req, res) => {
                console.log("Handling /book/details/:book_id POST request");
                this.bookController.addFavoriteBook()(req, res);
            }) // add favorite book
            .delete('/favoritebook/:uid/:book_id', (req, res) => {
                console.log("Handling /book/details/:book_id DELETE request");
                this.bookController.deleteFavoriteBook()(req, res);
            }) // delete favorite book
            .get('/favoritebook/count/:uid/:filter?', (req, res) => {
                console.log("Handling /favoritebook/count/:uid/:filter? GET request");
                console.log(req.params);
                this.bookController.favoriteBookCount()(req, res);
            }) // get favorite book count
            .get('/favoritebook/:uid/:page?/:filter?', (req, res) => {
                console.log("Handling /favoritebook/:uid/:filter/:page GET request");
                this.bookController.favoriteBookList()(req, res);
            }) // get favorite book list
            .post('/book/rating/:uid/:book_id', (req, res) => {
                console.log("Handling /book/rating/:uid/:book_id POST request");
                this.bookController.addRating()(req, res);
            }) // add rating
            .put('/book/rating/:uid/:book_id', (req, res) => {
                console.log("Handling /book/rating/:uid/:book_id PUT request");
                this.bookController.updateRating()(req, res);
            }) // update rating
    }
}
