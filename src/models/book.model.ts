import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn, OneToMany
} from "typeorm";

import { Author } from './author.model'
import { Category } from './category.model'
import {Chapter} from "./chapter.model";

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn({name: 'book_id'})
    bookId: number

    @Column()
    title: string

    @Column()
    description: string

    @Column({nullable: true})
    rating: number

    @ManyToOne(() => Author, (Author) => Author.books)
    @JoinColumn({name: 'author_id'})
    author: Author

    @ManyToOne(() => Category, (Category) => Category.books)
    @JoinColumn({name: 'category_id'})
    category: Category

    @Column({name: 'cover_image_directory', nullable: true})
    coverImageDirectory: string

    @Column()
    duration: string

    @OneToMany(() => Chapter, chapter => chapter.book)
    @JoinColumn({name: 'book_id'})
    chapters: Chapter[]
}