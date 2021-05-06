import { isInstanceOfError } from "@lib/instanceChecker";
import Admin from "@modules/admin/types";
import UserProvider from "@modules/user/provider";
import User from "@modules/user/types";
import {
    ErrorResponse, FileUpload, GenericRole, SuccessResponse,
} from "@shared/types";
import { GraphQLUpload, UserInputError, ValidationError } from "apollo-server-express";
import {
    Arg, Authorized, Ctx, Mutation, Query, Resolver,
} from "type-graphql";
import { EmailVerificationArgs, PhoneVerificationArgs } from "./input";
import UserVerificationProvider from "./provider";
import UserVerification from "./types";

@Resolver(of => UserVerification)
export default class UserVerificationResolver {
    // eslint-disable-next-line no-empty-function
    constructor(
        private readonly userVerificationProvider: UserVerificationProvider,
        private readonly userProvider: UserProvider,
    ) {}

    @Authorized()
    @Query(returns => UserVerification, { nullable: true })
    async getUserVerification(
        @Arg("userId") userId: string,
        @Ctx() ctx: { user: User },
    ): Promise<UserVerification | null> {
        return this.userVerificationProvider.getUserVerification(ctx.user.id);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => UserVerification, { nullable: true })
    async adminGetUserVerification(@Arg("userId") userId: string): Promise<UserVerification | null> {
        return this.userVerificationProvider.getUserVerification(userId);
    }

    @Authorized()
    @Mutation(returns => UserVerification)
    async createUserVerification(
        @Arg("userId") userId: string,
        @Ctx() ctx: { user: User },
    ): Promise<UserVerification | null> {
        const user = await this.userProvider.getUser(ctx.user.id);
        if (!user) {
            throw new Error("User Record not found");
        }

        return this.userVerificationProvider.createVerification(user);
    }

    @Authorized()
    @Mutation(returns => UserVerification)
    async verifyIdentity(
        @Arg("userId") userId: string,
        @Arg("file", () => GraphQLUpload!) file: FileUpload,
        @Ctx() ctx: { user: User },
    ): Promise<UserVerification> {
        if (!file) {
            throw new Error("Missing upload file parameter");
        }

        return this.userVerificationProvider.uploadIdentityDocument(ctx.user.id, file);
    }

    @Authorized()
    @Mutation(returns => UserVerification)
    async verifyUtilityBill(
        @Arg("userId") userId: string,
        @Arg("file", () => GraphQLUpload!) file: FileUpload,
        @Ctx() ctx: { user: User },
    ): Promise<UserVerification> {
        if (!file) {
            throw new Error("Missing upload file parameter");
        }

        return this.userVerificationProvider.uploadUtilityBill(ctx.user.id, file);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => UserVerification)
    async confirmIdentityDocument(
        @Arg("userId") userId: string,
        @Arg("comment") comment: string,
        @Ctx() ctx: { admin: Admin },
    ): Promise<UserVerification> {
        if (!userId) {
            throw new Error("Missing user parameter");
        }

        return this.userVerificationProvider.confirmIdentityDocument(userId, ctx.admin.id, ctx.admin.roleId, comment);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => UserVerification)
    async confirmUtilityBill(
        @Arg("userId") userId: string,
        @Arg("comment") comment: string,
        @Ctx() ctx: { admin: Admin },
    ): Promise<UserVerification> {
        if (!userId) {
            throw new Error("Missing user parameter");
        }

        return this.userVerificationProvider.confirmUtilityBill(userId, ctx.admin.id, ctx.admin.roleId, comment);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => UserVerification)
    async confirmEnrollmentDocument(
        @Arg("userId") userId: string,
        @Arg("comment") comment: string,
        @Ctx() ctx: { admin: Admin },
    ): Promise<UserVerification> {
        if (!userId) {
            throw new Error("Missing user parameter");
        }

        return this.userVerificationProvider.confirmEnrollmentDocument(userId, ctx.admin.id, ctx.admin.roleId, comment);
    }

    @Authorized()
    @Mutation(returns => UserVerification)
    async verifyEnrollment(
        @Arg("userId") userId: string,
        @Arg("file", () => GraphQLUpload!) file: FileUpload,
        @Ctx() ctx: { user: User },
    ):
        Promise<UserVerification> {
        if (!userId) {
            throw new Error("Missing user parameter");
        }
        if (!file) {
            throw new Error("Missing upload file parameter");
        }

        return this.userVerificationProvider.uploadEnrollmentDocument(ctx.user.id, file);
    }

    @Mutation(returns => SuccessResponse)
    async verifyEmail(@Arg("emailVerificationArgs", returns => EmailVerificationArgs)
        emailVerificationArgs: EmailVerificationArgs): Promise<SuccessResponse> {
        const user = await this.userProvider.getUserByEmail(emailVerificationArgs.email);
        if (!user) {
            const error = {
                message:    "Record does not exist",
                identifier: emailVerificationArgs.email,
                error:      `User with email ${emailVerificationArgs.email} does not exist`,
            };
            throw new ValidationError(error.error);
        }

        const response = await this.userVerificationProvider.verifyEmail(user, emailVerificationArgs.token);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as SuccessResponse;
    }

    @Authorized()
    @Mutation(returns => SuccessResponse)
    async verifyPhoneNumber(@Arg("phoneVerificationArgs", returns => PhoneVerificationArgs)
        phoneVerificationArgs: PhoneVerificationArgs): Promise<SuccessResponse> {
        const user = await this.userProvider.getUserByPhoneNumber(phoneVerificationArgs.phoneNumber);

        if (!user) {
            const error = {
                message:    "Record does not exist",
                identifier: phoneVerificationArgs.phoneNumber,
                error:      `User with phone ${phoneVerificationArgs.phoneNumber} does not exist`,
            };
            throw new ValidationError(error.error);
        }

        const response = await this.userVerificationProvider.verifyPhoneNumber(user, phoneVerificationArgs.token);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as SuccessResponse;
    }
}
