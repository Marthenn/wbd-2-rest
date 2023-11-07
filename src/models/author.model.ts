import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn
} from "typeorm";

import { Book } from './book.model'

@Entity()
export class Author {
    @PrimaryGeneratedColumn({name:'author_id'})
    authorId: number

    @Column()
    name: string

    @Column({nullable: true})
    description: string

    @OneToMany(type => Book, (Book) => Book.author)
    @JoinColumn({name:'author_id'})
    books : Book[]
}