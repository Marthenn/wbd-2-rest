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
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn({name:'category_id'})
    categoryId: number

    @Column()
    name: string

    @OneToMany(type => Book, (Book) => Book.category)
    @JoinColumn({name:'category_id'})
    books: Book[]
}