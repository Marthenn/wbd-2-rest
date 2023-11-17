import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Book } from '../models/book.model';
import { Rating } from '../models/rating.model';
import { Chapter } from '../models/chapter.model';
import { Favorite } from '../models/favorite.model';
import { createConnection } from 'typeorm';
import { Account } from "../models/account.model";
import { AuthRequest } from "../middlewares/authentication.middlewares";
import * as fs from "fs";
import * as path from "path";

export class BookController {
    index() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }
            // Check page parameter availability
            let page;
            if (parseInt(req.params.page)) {
                page = parseInt(req.params.page);
            } else {
                page = 1;
            }

            // Check filter parameter availability
            let filterBook = "";
            if (req.params.filter) {
                filterBook = req.params.filter;
            }
            
            const itemsPerPage = 8;
            
            try {
                const books = await Rating.createQueryBuilder('rating')
                    .select('book.book_id', 'book_id')
                    .addSelect('book.title', 'title')
                    .addSelect('book.duration', 'duration')
                    .addSelect('AVG(rating.rating)', 'averageRating')
                    .addSelect('book.cover_image_directory', 'cover_image_directory')
                    .addSelect('book.author', 'author')
                    .innerJoin(Book, 'book', 'book.book_id = rating.book_id')
                    .where('book.title ILIKE :filter', { filter: `%${filterBook}%` })
                    .groupBy('book.book_id, book.title, book.duration')
                    .offset((page - 1) * itemsPerPage) // Skip items
                    .limit(itemsPerPage)  // Limit items
                    .getRawMany();
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                    books,
                });
                console.log(books);
            } catch (error) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        };
    }

    bookCount() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                // Check filter parameter availability
                let filterBook = "";
                if (req.params.filter) {
                    filterBook = req.params.filter;
                }
                const bookCountRaw = await Book.createQueryBuilder('book')
                    .select('COUNT(*)', 'bookCount')
                    .where('book.title ILIKE :filter', { filter: `%${filterBook}%` })
                    .getRawOne();
                const bookCount = parseInt(bookCountRaw.bookCount);
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                    bookCount,
                });
                console.log(bookCount);
            } catch (error) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        };
    }

    bookDetails() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            let bookId;
            if(parseInt(req.params.book_id)) {
                bookId = parseInt(req.params.book_id);
            } else {
                bookId = 1;
            }

            try {
                const bookDetails = await Rating.createQueryBuilder('rating')
                    .select('book.book_id', 'book_id')
                    .addSelect('book.title', 'title')
                    .addSelect('book.duration', 'duration')
                    .addSelect('book.description', 'description')
                    .addSelect('book.cover_image_directory', 'cover_image_directory')
                    .addSelect('AVG(rating.rating)', 'averageRating')
                    .addSelect('book.author', 'author')
                    .addSelect('book.category', 'category')
                    .innerJoin(Book, 'book', 'book.book_id = rating.book_id')
                    .where('book.book_id = :book_id', { book_id: bookId })
                    .groupBy('book.book_id, book.title, book.duration, book.description, book.cover_image_directory')
                    .getRawOne();
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                    bookDetails,
                });
                console.log(bookDetails);
            } catch (error) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        };
    }

    chapterCount() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }
            try {
                const chapterCount = await Chapter.createQueryBuilder('chapter')
                    .select('chapter.chapter_id', 'chapterId')
                    .addSelect('chapter.chapter_name', 'chapterName')
                    .innerJoin('chapter.book', 'book', 'book.book_id = :book_id', { book_id: parseInt(req.params.book_id) })
                    .getCount();
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                    chapterCount,
                });
                console.log(chapterCount);
            } catch (error) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        };  
    }

    chapterNames() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            const chapterPerPage = 5;
            // Check page parameter availability
            let page;
            if (parseInt(req.params.page)) {
                page = parseInt(req.params.page);
            } else {
                page = 1;
            }

            try {
                const chapterNames = await Chapter.createQueryBuilder('chapter')
                .select('chapter.chapter_id', 'chapterId')
                .addSelect('chapter.chapter_name', 'chapterName')
                .innerJoin('chapter.book', 'book', 'book.book_id = :book_id', { book_id: parseInt(req.params.book_id) })
                .offset((page - 1) * chapterPerPage)
                .limit(chapterPerPage)
                .getRawMany();
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                    chapterNames,
                });
                console.log(chapterNames);
            } catch (error) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        };        
    }

    chapterDetails() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                const chapterDetails = await Chapter.createQueryBuilder('chapter')
                .select('chapter.chapter_id', 'chapter_id')
                .addSelect('chapter.chapter_name', 'chapter_name')
                .addSelect('chapter.transcript', 'transcript')
                .addSelect('chapter.audio_directory', 'audio_directory')
                .addSelect('book.title', 'title')
                .innerJoin(Book, 'book', 'book.book_id = chapter.book_id')
                .where('chapter.chapter_id = :chapter_id', { chapter_id: parseInt(req.params.chapter_id) })
                .andWhere('book.book_id = :book_id', { book_id: parseInt(req.params.book_id) })
                .getRawMany();
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                    chapterDetails,
                });
                console.log(chapterDetails);
            } catch (error) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        };    
    }

    isFavoriteBook() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }
            try {
                const isFavoriteBook = await Favorite.createQueryBuilder('favorite')
                    .innerJoin('favorite.books', 'favoriteBook', 'favoriteBook.bookId = :book_id', { book_id: parseInt(req.params.book_id) })
                    .where('favorite.uid = :uid', { uid : parseInt(req.params.uid) })
                    .select('favorite.favoriteId')
                    .getOne();
                if (!isFavoriteBook) {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                        isFavoriteBook: false,
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                        isFavoriteBook: true,
                    });
                }
            } catch (error: any) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                })
            }
        }
    }

    favoriteBookList() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Check page parameter availability
            let page;
            if (parseInt(req.params.page)) {
                page = parseInt(req.params.page);
            } else {
                page = 1;
            }

            // Check filter parameter availability
            let filterBook = "";
            if (req.params.filter) {
                filterBook = req.params.filter;
            }
            
            const itemsPerPage = 8;
            
            try {
                const favoriteBooks = await Book.createQueryBuilder('book')
                    .distinctOn(['book.book_id'])
                    .select([
                        'book.book_id as book_id',
                        'book.title as title',
                        'book.duration as duration',
                        'book.cover_image_directory as cover_image_directory',
                        'book.author as author',
                        'AVG(rating.rating) as averageRating', 
                    ])
                    .innerJoin('favorite_book', 'favorite_book', 'favorite_book.book_id = book.book_id')
                    .innerJoin('favorite', 'favorite', 'favorite.favorite_id = favorite_book.favorite_id')
                    .leftJoin('rating', 'rating', 'rating.book_id = book.book_id') 
                    .where('favorite.uid = :uid', { uid: parseInt(req.params.uid) })
                    .andWhere('book.title ILIKE :filter', { filter: `%${filterBook}%` })
                    .groupBy('book.book_id')
                    .offset((page - 1) * itemsPerPage) // Skip items
                    .limit(itemsPerPage)  // Limit items
                    .getRawMany();
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                    favoriteBooks,
                });
                console.log(favoriteBooks);
            } catch (error) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        };
    }

    favoriteBookCount() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Check filter parameter availability
            let filterBook = "";
            if (req.params.filter) {
                filterBook = req.params.filter;
            }
            try {
                const favoriteBooks = await Book.createQueryBuilder('book')
                    .distinctOn(['book.book_id'])
                    .select('book.book_id as book_id')
                    .innerJoin('favorite_book', 'favorite_book', 'favorite_book.book_id = book.book_id')
                    .innerJoin('favorite', 'favorite', 'favorite.favorite_id = favorite_book.favorite_id')
                    .where('favorite.uid = :uid', { uid: parseInt(req.params.uid) })
                    .andWhere('book.title ILIKE :filter', { filter: `%${filterBook}%` })
                    .groupBy('book.book_id')
                    .getRawMany();
                const favoriteBookCount = favoriteBooks.length;
                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                    favoriteBookCount,
                });
                console.log(favoriteBookCount);
            } catch (error: any) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        };
    }

    addFavoriteBook() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }
            
            try {
                const favoriteBookIdRaw = await Book.createQueryBuilder('book')
                    .distinctOn(['book.book_id'])
                    .select('book.book_id as book_id')
                    .innerJoin('favorite_book', 'favorite_book', 'favorite_book.book_id = book.book_id')
                    .innerJoin('favorite', 'favorite', 'favorite.favorite_id = favorite_book.favorite_id')
                    .where('favorite.uid = :uid', { uid: parseInt(req.params.uid) })
                    .groupBy('book.book_id')
                    .getRawMany();
                let bookIdList = favoriteBookIdRaw.map((favoriteBookIdRaw) => favoriteBookIdRaw.book_id);
                bookIdList.push(parseInt(req.params.book_id));
                console.log(bookIdList);
                const account = await Account.findOneBy({ uid: parseInt(req.params.uid) });
                const books = await Book.findByIds(bookIdList);

                const newFavorite = new Favorite();
                newFavorite.account = account;
                newFavorite.books = books;
                const newFavoriteId = await newFavorite.save();

                if (!newFavoriteId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: ReasonPhrases.BAD_REQUEST,
                    });
                    return;
                }

                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                });
            } catch(error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    deleteFavoriteBook() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                const favoriteBookIdRaw = await Favorite.createQueryBuilder('favorite')
                    .innerJoin('favorite.books', 'favoriteBook', 'favoriteBook.bookId = :book_id', { book_id: parseInt(req.params.book_id) })
                    .where('favorite.uid = :uid', { uid : parseInt(req.params.uid) })
                    .select('favorite.favoriteId')
                    .getOne();
                const favoriteBookId = favoriteBookIdRaw.favoriteId;
                const favorite = await Favorite.findOneBy({ favoriteId: favoriteBookId });
                const deleteFavoriteBookId = await favorite.remove();
                if (!deleteFavoriteBookId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: ReasonPhrases.BAD_REQUEST,
                    });
                    return;
                }

                res.status(StatusCodes.OK).json({
                    message: ReasonPhrases.OK,
                });

            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    // Check if rating is null or not, for differentiating between addRating (POST) and updateRating (PUT)
    ratingStatus() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                const rating = await Rating.createQueryBuilder('rating')
                    .select('rating.*')
                    .where('rating.book_id = :book_id', { book_id: parseInt(req.params.book_id) })
                    .andWhere('rating.uid = :uid', { uid: parseInt(req.params.uid) })
                    .getRawMany();
                console.log(rating);
                if (rating.length === 0) {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                        ratingStatus: false,
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                        ratingStatus: true,
                    });
                }
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    addRating() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                const rating = new Rating();
                rating.rating = parseFloat(req.body.rating);
                rating.book = await Book.findOneBy({ bookId: parseInt(req.params.book_id) });
                rating.account = await Account.findOneBy({ uid: parseInt(req.params.uid) });
                const ratingId = await rating.save();
                if (!ratingId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: ReasonPhrases.BAD_REQUEST,
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                    });
                }
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    updateRating() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || token.isAdmin) { // Only user can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                const rating = await Rating.createQueryBuilder('rating')
                    .where('rating.book_id = :book_id', { book_id: parseInt(req.params.book_id) })
                    .andWhere('rating.uid = :uid', { uid: parseInt(req.params.uid) })
                    .getOne();
                rating.rating = parseFloat(req.body.rating);
                const ratingId = await rating.save();
                if (!ratingId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: ReasonPhrases.BAD_REQUEST,
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                    });
                }
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    addChapter() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || !token.isAdmin) { // Only admin can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                const chapter = new Chapter();
                chapter.chapterName = req.body.chapterName;
                chapter.transcript = req.body.transcript;
                chapter.audioDirectory = req.body.audioDirectory;
                chapter.book = await Book.findOneBy({ bookId: parseInt(req.params.book_id) });
                const chapterId = await chapter.save();
                if (!chapterId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: ReasonPhrases.BAD_REQUEST,
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                    });
                }
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    updateChapter() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || !token.isAdmin) { // Only admin can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                const chapter = await Chapter.createQueryBuilder('chapter')
                    .where('chapter.chapter_id = :chapter_id', { chapter_id: parseInt(req.params.chapter_id) })
                    .getOne(); // Use get chapterNames to get chapter_id
                // TODO: Check file
                const oldFilename = chapter.audioDirectory;
                fs.unlinkSync(path.join(__dirname, `../../public/audio/${oldFilename}`));
                chapter.chapterName = req.body.chapterName;
                chapter.transcript = req.body.transcript;
                // chapter.audioDirectory = req.body.audioDirectory;
                chapter.audioDirectory = req.file!.filename;
                chapter.book = await Book.findOneBy({ bookId: parseInt(req.params.book_id) });
                const chapterId = await chapter.save();
                if (!chapterId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: ReasonPhrases.BAD_REQUEST,
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                    });
                }
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    deleteChapter() {
        return async (req: Request, res: Response) => {
            // TODO: Check token in methods
            const { token } = req as AuthRequest;
            if (!token || !token.isAdmin) { // Only admin can access this method
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                const chapter = await Chapter.createQueryBuilder('chapter')
                    .where('chapter.chapter_id = :chapter_id', { chapter_id: parseInt(req.params.chapter_id) })
                    .getOne(); // Use get chapterNames to get chapter_id
                // TODO: Check file
                const oldFilename = chapter.audioDirectory;
                fs.unlinkSync(path.join(__dirname, `../../public/audio/${oldFilename}`));
                const deleteChapterId = await chapter.remove();
                if (!deleteChapterId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: ReasonPhrases.BAD_REQUEST,
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        message: ReasonPhrases.OK,
                    });
                }
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
}

