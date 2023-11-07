import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn
} from "typeorm";

import { Book } from './book.model'

@Entity()
export class Category {

}