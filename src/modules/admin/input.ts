import { Field, InputType } from "type-graphql";

@InputType()
export default class AdminArg {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    roleId: string;
}
