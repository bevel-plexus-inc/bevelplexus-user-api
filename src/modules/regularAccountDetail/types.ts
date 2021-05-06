import Country from "@shared/country";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class RegularAccountDetail {
    @Field()
    id: string;

    @Field()
    userId: string;

    @Field()
    address: string;

    @Field()
    city: string;

    @Field()
    postalCode: string;

    @Field()
    countryId: string;

    @Field(returns => Country, { nullable: true })
    country?: Country;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;
}
