// eslint-disable-next-line max-classes-per-file
import Recipient from "@modules/recipient/types";
import RegularAccountDetail from "@modules/regularAccountDetail/types";
import StudentAccountDetail from "@modules/studentAccountDetail/types";
import UserKyc from "@modules/userKyc/types";
import UserVerification from "@modules/userVerification/types";
import { UserType } from "@shared/types";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class User {
    @Field()
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field()
    password: string;

    @Field(type => UserType)
    userType: UserType;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;

    @Field(type => StudentAccountDetail, { nullable: true })
    studentAccountDetail?: StudentAccountDetail;

    @Field(type => RegularAccountDetail, { nullable: true })
    regularAccountDetail?: RegularAccountDetail;

    @Field(type => UserKyc, { nullable: true })
    userKyc?: UserKyc;

    @Field(type => UserVerification, { nullable: true })
    userVerification: UserVerification;

    @Field(type => [Recipient])
    recipient: Array<Recipient>;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class UserAnalytics {
    @Field()
    weekCount: number;

    @Field()
    monthCount: number;

    @Field()
    dayCount: number;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class UserRegistrationAnalytics {
    @Field()
    month: string;

    @Field()
    count: number;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class UserList {
    @Field(returns => [User])
    users: Array<User>;

    @Field()
    total: number;
}
