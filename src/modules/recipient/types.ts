// eslint-disable-next-line max-classes-per-file
import Transaction from "@shared/transaction";
import { Field, ObjectType } from "type-graphql";
import BankInfo from "../bankInfo/types";

@ObjectType()
export default class Recipient {
    @Field()
    id: string;

    @Field()
    userId: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    phoneNumber: string;

    @Field()
    location: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;

    @Field(type => [BankInfo])
    bankInfo: Array<BankInfo>;

    @Field(type => Transaction, { nullable: true })
    transaction?: Transaction;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class RecipientList {
    @Field()
    total: number;

    @Field(type => [Recipient])
    recipients: Array<Recipient>;
}
