// eslint-disable-next-line max-classes-per-file
import Admin from "@modules/admin/types";
import { Field, ObjectType } from "type-graphql";
import UserType from "../user/types";

@ObjectType()
export class AuthenticatedData {
    @Field()
    token: string;

    @Field(returns => UserType)
    user: UserType;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class AdminAuthenticatedData {
    @Field()
    token: string;

    @Field(returns => Admin)
    admin: Admin;
}
