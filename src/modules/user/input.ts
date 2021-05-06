// eslint-disable-next-line max-classes-per-file
import { UserType } from "@shared/types";
import { Field, InputType } from "type-graphql";

@InputType()
export default class UserArgs {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field({ nullable: true })
    referralCode?: string;

    @Field()
    password: string;

    @Field(type => UserType)
    userType: UserType;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class UserUpdateArgs {
    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    phoneNumber?: string;
}
