import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Book } from '../models/book.model';

export class BookController {
    index() {
        return async (_req: Request, res: Response) => {
            console.log("Handling /book request"); // Add this line for debugging
            try {
                const books = await Book.createQueryBuilder('book')
                    .select(['book.book_id', 'book.title', 'book.rating', 'book.duration'])
                    .take(8)
                    .getMany();
                res.status(StatusCodes.OK).json({
                    message: false,
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

    bookDetails() {
        return async (req: Request, res: Response) => {
            console.log("Handling /book/:id request");
            try {
                const book = await Book.createQueryBuilder('book')
                    .select(['book.book_id', 'book.title', 'book.rating', 'book.duration', 'book.description', 'book.cover_image_directory'])
                    .where('book.book_id = :id', { 
                        id: parseInt(req.params.id) 
                    })
                    .getOne();
                res.status(StatusCodes.OK).json({
                    message: false,
                    book,
                });
                console.log(book);
            } catch (error) {
                console.error(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
            }
        };
    }
}

