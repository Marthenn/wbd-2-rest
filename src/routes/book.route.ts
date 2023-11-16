import { Router } from 'express';

import { AuthenticationMiddleware } from "../middlewares/authentication.middlewares";
import { UploadMiddleware } from "../middlewares/upload.middleware";
import { BookController } from '../controllers/book.controller';

export class BookRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    bookController: BookController;
    uploadMiddleware: UploadMiddleware;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.bookController = new BookController();
        this.uploadMiddleware = new UploadMiddleware();
    }

    getRoute() {
        console.log("Setting up /book route");
        return Router()
            .get('/book/details/:book_id/chapter/:chapter_id?', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/details/:book_id/chapter/:chapter_id GET request");
                    this.bookController.chapterDetails()(req, res);
                }) // get chapter details
            .get('/book/details/:book_id/chapternames', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/details/:book_id/chapternames GET request");
                    this.bookController.chapterNames()(req, res);
                }) // get chapter names and ids
            .get('/book/details/:book_id?', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/details/:book_id GET request");
                    this.bookController.bookDetails()(req, res);
                }) // get book details
            .get('/book/rating/:uid/:book_id', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/rating/:uid/:book_id GET request");
                    this.bookController.ratingStatus()(req, res);
                }) // get rating status
            .get('/book/count/:filter?', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/count/filter? GET request");
                    this.bookController.bookCount()(req, res);
                }) // get book count
            .get('/book/:page?/:filter?', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/:filter/:page GET request");
                    this.bookController.index()(req, res);
                }) // get book list
            .post('/favoritebook/:uid/:book_id', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/details/:book_id POST request");
                    this.bookController.addFavoriteBook()(req, res);
                }) // add favorite book
            .delete('/favoritebook/:uid/:book_id', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/details/:book_id DELETE request");
                    this.bookController.deleteFavoriteBook()(req, res);
                }) // delete favorite book
            .get('/favoritebook/count/:uid/:filter?', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /favoritebook/count/:uid/:filter? GET request");
                    this.bookController.favoriteBookCount()(req, res);
                }) // get favorite book count
            .get('/favoritebook/:uid/:page?/:filter?', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /favoritebook/:uid/:filter/:page GET request");
                    this.bookController.favoriteBookList()(req, res);
                }) // get favorite book list
            .post('/book/rating/:uid/:book_id', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/rating/:uid/:book_id POST request");
                    this.bookController.addRating()(req, res);
                }) // add rating
            .put('/book/rating/:uid/:book_id', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/rating/:uid/:book_id PUT request");
                    this.bookController.updateRating()(req, res);
                }) // update rating
            .post('/book/details/:book_id/chapter', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                // TODO: check file
                (req, res, next) => {
                    this.uploadMiddleware.upload('audio')(req, res, next);
                },
                (req, res) => {
                    console.log("Handling /book/details/:book_id/chapter POST request");
                    this.bookController.addChapter()(req, res);
                }) // add chapter
            .put('/book/details/:book_id/chapter/:chapter_id', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                // TODO: check file
                (req, res, next) => {
                    this.uploadMiddleware.upload('audio')(req, res, next);
                },
                (req, res) => {
                    console.log("Handling /book/details/:book_id/chapter/:chapter_id PUT request");
                    this.bookController.updateChapter()(req, res);
                }) // update chapter
            .delete('/book/details/:book_id/chapter/:chapter_id', 
                // TODO: uncomment token
                // (req, res, next) => {
                //     this.authenticationMiddleware.authenticate()(req, res, next);
                // },
                (req, res) => {
                    console.log("Handling /book/details/:book_id/chapter/:chapter_id DELETE request");
                    this.bookController.deleteChapter()(req, res);
                }) // delete chapter
    }
}
