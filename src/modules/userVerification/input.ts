// eslint-disable-next-line max-classes-per-file
import { EmailType } from "@shared/types";
import { Field, InputType } from "type-graphql";

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class EmailVerificationArgs {
    @Field()
    email: string;

    @Field()
    token: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class PhoneVerificationArgs {
    @Field()
    phoneNumber: string;

    @Field()
    token: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export default class Recipient {
    @Field()
    name: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class EmailParameter {
    @Field({ nullable: true })
    verificationUrl?: string;

    @Field({ nullable: true })
    otp?: string;

    @Field(returns => [Recipient])
    receivers: Array<Recipient>;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class EmailArgs {
    @Field(returns => EmailParameter)
    parameters: EmailParameter;

    @Field(returns => EmailType)
    emailType: EmailType;
}
