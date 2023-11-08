import { DataSourceOptions } from "typeorm";

import {Account} from "../models/account.model";
import {Author} from "../models/author.model";
import {Book} from "../models/book.model";
import {Category} from "../models/category.model";
import {Chapter} from "../models/chapter.model";
import {FaceID} from "../models/faceid.model";
import {Favorite} from "../models/favorite.model";
import {History} from "../models/history.model";
import {AccountSubscriber} from "../subscribers/account.subscriber";
import * as dotenv from 'dotenv';
dotenv.config({path: '.env'})
const generatePostgreHost = () => {
    return process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
}

const generatePostgrePort = () => {
    return process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
}

const generatePostgreUsername = () => {
    return process.env.DB_USER ? process.env.DB_USER : 'postgres';
}

const generatePostgrePassword = () => {
    return process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'password';
}

const generatePostgreDatabase = () => {
    return process.env.DB_NAME ? process.env.DB_NAME : 'postgres';
}

export const dataConfig: DataSourceOptions = {
    type: 'postgres',
    host: generatePostgreHost(),
    port: generatePostgrePort(),
    username: generatePostgreUsername(),
    password: generatePostgrePassword(),
    database: generatePostgreDatabase(),
    entities: [
        Account,
        Author,
        Book,
        Category,
        Chapter,
        FaceID,
        Favorite,
        History
    ],
    synchronize: true,
    logging: true,
    subscribers: [AccountSubscriber]
}