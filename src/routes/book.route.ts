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
                this.authenticationMiddleware.authenticate(),
                this.bookController.chapterDetails()
            )    // get chapter details
            .get('/book/details/:book_id/chapternames/:page?', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.chapterNames()
            )    // get chapter names and ids
            .get('/book/details/:book_id/count',
                this.authenticationMiddleware.authenticate(),
                this.bookController.chapterCount()
            )   // get chapter count
            .get('/book/details/:book_id?', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.bookDetails()
            )    // get book details
            .get('/book/rating/:uid/:book_id', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.ratingStatus()
            )    // get rating status
            .get('/book/count/:filter?', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.bookCount()
            )    // get book count
            .get('/book/favoritestatus/:uid/:book_id',
                this.authenticationMiddleware.authenticate(),
                this.bookController.isFavoriteBook()
            ) // get favorite book status
            .get('/book/:page?/:filter?', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.index()
            )    // get book list
            .post('/favoritebook/:uid/:book_id', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.addFavoriteBook()
            )    // add favorite book
            .delete('/favoritebook/:uid/:book_id', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.deleteFavoriteBook()
            )    // delete favorite book
            .get('/favoritebook/count/:uid/:filter?', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.favoriteBookCount()
            )    // get favorite book count
            .get('/favoritebook/:uid/:page?/:filter?', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.favoriteBookList()
            )    // get favorite book list
            .post('/book/rating/:uid/:book_id', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.addRating()
            )    // add rating
            .put('/book/rating/:uid/:book_id', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.updateRating()
            )    // update rating
            .post('/book/details/:book_id/chapter', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                // TODO: check file
                this.uploadMiddleware.upload('audio'),
                this.bookController.addChapter()
            )    // add chapter
            .put('/book/details/:book_id/chapter/:chapter_id', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                // TODO: check file
                this.uploadMiddleware.upload('audio'),
                this.bookController.updateChapter()
            ) // update chapter
            .delete('/book/details/:book_id/chapter/:chapter_id', 
                // TODO: uncomment token
                this.authenticationMiddleware.authenticate(),
                this.bookController.deleteChapter()
                // delete chapter
            )
    }
}
