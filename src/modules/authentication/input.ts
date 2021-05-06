// eslint-disable-next-line max-classes-per-file
import { UserType } from "@shared/types";
import { Field, InputType } from "type-graphql";

@InputType()
export class LoginArgs {
    @Field()
    email: string;

    @Field()
    password: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class ResetPasswordArgs {
    @Field()
    password: string;

    @Field()
    formToken: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class OTPValidationArgs {
    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field()
    otp: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class SignUpArgs {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    referralCode?: string;

    @Field(type => UserType)
    userType: UserType;

    @Field()
    password: string;

    @Field()
    confirmPassword: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class PhoneNumberArgs {
    @Field()
    phoneNumber: string;

    @Field()
    userId: string;
}
