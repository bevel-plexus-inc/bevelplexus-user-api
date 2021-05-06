import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class BankInfo {
    @Field()
    id: string;

    @Field()
    recipientId: string;

    @Field()
    bank: string;

    @Field()
    bankCode: string;

    @Field()
    accountNumber: string;

    @Field({ nullable: true })
    transitOrSortCode?: string;
}
