import { Field, InputType } from "type-graphql";

@InputType()
export default class RegularAccountDetailArgs {
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
}
