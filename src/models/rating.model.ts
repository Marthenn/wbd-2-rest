import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { Book } from "./book.model";
import { Account } from "./account.model";

@Entity('rating')
export class Rating extends BaseEntity {
    @PrimaryGeneratedColumn({name: 'rating_id'})
    id: number

    @Column({name: 'rating', type: "real"})
    rating: number

    @ManyToOne(() => Book)
    @JoinColumn({name: 'book_id'})
    book: Book

    @ManyToOne(() => Account)
    @JoinColumn({name: 'uid'})
    account: Account
}