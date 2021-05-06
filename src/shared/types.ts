// eslint-disable-next-line max-classes-per-file
import { ReadStream } from "fs";
import { Field, ObjectType, registerEnumType } from "type-graphql";

export enum UserType {
    Regular = "Regular",
    Student = "Student",
}

registerEnumType(UserType, {
    name:        "UserType",
    description: "user type for users",
});

@ObjectType()
export class ErrorResponse {
    @Field()
    message: string;

    @Field()
    identifier: string;

    @Field()
    error: string;
}

export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream(): ReadStream;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class SuccessResponse {
    @Field()
    message: string;

    @Field()
    identifier: string;
}

export interface ReturnMessage {
    error: boolean;
    message: string;
}

export enum EmailType {
    TransactionConfirmation = "TransactionConfirmation",
    SignUpSuccess = "SignUpSuccess",
    KYCVerificationSuccess = "KYCVerificationSuccess",
    KYCVerification = "KYCVerification",
    EmailVerification = "EmailVerification",
    RequestHelp = "RequestHelp",
    ResetPassword = "ResetPassword",
}

registerEnumType(EmailType, {
    name:        "EmailType",
    description: "types of email",
});

export enum GenericRole {
    Admin = "ADMIN",
}
