import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Book } from '../models/book.model';
import { Rating } from '../models/rating.model';

export class BookController {
    index() {
        return async (_req: Request, res: Response) => {
            console.log("Handling /book request"); // Add this line for debugging
            try {
                const books = await Rating.createQueryBuilder('rating')
                    .select('book.book_id', 'book_id')
                    .addSelect('book.title', 'title')
                    .addSelect('book.duration', 'duration')
                    .addSelect('AVG(rating.rating)', 'averageRating')
                    .innerJoin(Book, 'book', 'book.book_id = rating.book_id')
                    .groupBy('book.book_id, book.title, book.duration')
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
        return async (_req: Request, res: Response) => {
            console.log("Handling /book/count request"); // Add this line for debugging
            try {
                const bookCount = await Book.createQueryBuilder('book')
                    .select('COUNT(*)', 'bookCount')
                    .getRawOne();
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
            console.log("Handling /book/:id request");
            try {
                const bookDetails = await Rating.createQueryBuilder('rating')
                    .select('book.book_id', 'book_id')
                    .addSelect('book.title', 'title')
                    .addSelect('book.duration', 'duration')
                    .addSelect('book.description', 'description')
                    .addSelect('book.cover_image_directory', 'cover_image_directory')
                    .addSelect('AVG(rating.rating)', 'averageRating')
                    .innerJoin(Book, 'book', 'book.book_id = rating.book_id')
                    .where('book.book_id = :id', { id: parseInt(req.params.id) })
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


}

