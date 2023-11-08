import {
    Entity,
    PrimaryColumn,
    OneToOne,
    JoinColumn
} from "typeorm";
import {Account} from "./account.model";

@Entity()
export class FaceID{
    @PrimaryColumn({name:'facial_id'})
    facialId: string

    @OneToOne(() => Account, {nullable: true})
    @JoinColumn({name:'uid'})
    account: Account
}