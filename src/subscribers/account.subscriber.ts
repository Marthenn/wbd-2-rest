import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent
} from 'typeorm';

import bcrypt from "bcrypt";

import { bcryptConfig } from "../config/bcrypt.config";
import { Account } from "../models/account.model";

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account>{
    listenTo(): Function | string {
        return Account;
    }

    // async beforeInsert(event: InsertEvent<Account>): Promise<void> {
    //     event.entity.password = await bcrypt.hash(event.entity.password, bcryptConfig.SaltRounds);
    // }
    //
    // async beforeUpdate(event: UpdateEvent<Account>): Promise<void> {
    //     if (event.entity && event.entity.password !== event.databaseEntity.password) {
    //         event.entity.password = await bcrypt.hash(event.entity.password, bcryptConfig.SaltRounds);
    //     }
    // }
}