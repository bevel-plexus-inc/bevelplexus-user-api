// eslint-disable-next-line max-classes-per-file
import { Field, InputType } from "type-graphql";

@InputType()
export default class RecipientArgs {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    phoneNumber: string;

    @Field()
    location: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class RecipientUpdateArgs {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    phoneNumber: string;

    @Field()
    location: string;
}
