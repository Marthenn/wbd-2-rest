import * as dotenv from 'dotenv';
dotenv.config({path: '.env'});

import { Book } from "../models/book.model";

export class cronMiddleware {
    synchronizeBook() {
        return async () => {
            const phpUrl = process.env.PHP_BASE_HOST;

            // create the form data
            const formData = new FormData();
            formData.append('key', process.env.PHP_KEY);

            // create a xhr form data
            const xhr = new XMLHttpRequest();
            xhr.open('POST', phpUrl + '/Syncrhonizer/synchronizeBook');
            xhr.send(formData);

            xhr.onreadystatechange = async () => {
                // wait until the request is done
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        /*
                        The data is in a json
                        {
                        "books": [
                         (input with book)
                        ]
                        }

                        the book in json is in this format
                        {
                            "bid": 1,
                            "title": "Book 1",
                            "description": "Description for Book 1",
                            "rating": "1.4870181",
                            "aid": 3,
                            "cid": 3,
                            "duration": "01:29:04",
                            "cover_image_directory": ""
                        }
                         */

                        const booksJSON = JSON.parse(xhr.responseText).books;
                        const bookKeys = booksJSON.map(book => Object.keys(book));

                        // find the smallest bid key in bookKeys
                        let current_id: number | undefined = Math.min(...bookKeys.map(bookKey => bookKey.bid));

                        // get the smallest book id from database
                        const smallestId = await Book.createQueryBuilder('book')
                            .select('MIN(account.book_id)', 'book_id')
                            .getOne();

                        if (smallestId?.bookId < current_id) {
                            current_id = smallestId?.bookId;
                        }

                        // traverse the databases --> get all first
                        const dataBaseBooks = await Book.createQueryBuilder('book')
                            .select(['book.bookId', 'book.title', 'book.description', 'book.rating', 'book.authorId', 'book.categoryId', 'book.duration', 'book.coverImageDirectory'])
                            .getMany();

                        for (const book of bookKeys) {

                        }
                    }
                }
            }
        }
    }
}