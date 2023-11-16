import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Book } from '../models/book.model';
import { Rating } from '../models/rating.model';
import { Chapter } from '../models/chapter.model';

export class BookController {
    index() {
        return async (req: Request, res: Response) => {
            let page;
            if (parseInt(req.params.page)) {
                console.log("Handling /book/:page request"); // Add this line for debugging
                page = parseInt(req.params.page);
            } else {
                console.log("Handling /book request"); // Add this line for debugging
                page = 1;
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
                    .groupBy('book.book_id, book.title, book.duration')
                    .offset((page - 1) * itemsPerPage)  // Calculate the offset based on the page number
                    .limit(itemsPerPage)  // Set the limit to the number of items per page
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
            console.log("Handling /book/:book_id request");
            try {
                const bookDetails = await Rating.createQueryBuilder('rating')
                    .select('book.book_id', 'book_id')
                    .addSelect('book.title', 'title')
                    .addSelect('book.duration', 'duration')
                    .addSelect('book.description', 'description')
                    .addSelect('book.cover_image_directory', 'cover_image_directory')
                    .addSelect('AVG(rating.rating)', 'averageRating')
                    .innerJoin(Book, 'book', 'book.book_id = rating.book_id')
                    .where('book.book_id = :book_id', { book_id: parseInt(req.params.book_id) })
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

    chapterNames() {
        return async (req: Request, res: Response) => {
            console.log("Handling /book/:book_id/chapternames request");
            try {
                const chapterNames = await Chapter.createQueryBuilder('chapter')
                .select('chapter.chapter_id', 'chapterId')
                .addSelect('chapter.chapter_name', 'chapterName')
                .innerJoin('chapter.book', 'book', 'book.book_id = :book_id', { book_id: parseInt(req.params.book_id) })
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
            
            try {
                const chapterDetails = await Chapter.createQueryBuilder('chapter')
                .select('chapter.chapter_name', 'chapter_name')
                .addSelect('chapter.transcript_directory', 'transcript_directory')
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
}

