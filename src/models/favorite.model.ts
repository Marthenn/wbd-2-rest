import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable
} from 'typeorm'

import { Book } from './book.model'

@Entity('favorite')
export class Favorite extends BaseEntity {
    @PrimaryGeneratedColumn({name:'favorite_id'})
    favoriteId: number

    @ManyToMany(type => Book)
    @JoinTable({
        name: 'favorite_book',
        joinColumn: {
            name: 'book_id',
            referencedColumnName: 'bookId'
        },
        inverseJoinColumn: {
            name: 'book_id',
            referencedColumnName: 'bookId'
        }
    })
    books: Book[]
}