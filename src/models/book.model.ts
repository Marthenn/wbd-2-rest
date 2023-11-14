import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn, OneToMany
} from "typeorm";

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

    @Column({name: 'author'})
    author: String

    @Column({name: 'category'})
    category: String

    @Column({name: 'cover_image_directory', nullable: true})
    coverImageDirectory: string

    @Column()
    duration: string

    @OneToMany(() => Chapter, chapter => chapter.book)
    @JoinColumn({name: 'book_id'})
    chapters: Chapter[]
}