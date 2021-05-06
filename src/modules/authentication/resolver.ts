import { getEncryptedPassword } from "@lib/authentication";
import { isInstanceOfError } from "@lib/instanceChecker";
import User from "@models/user";
import UserProvider from "@modules/user/provider";
import UserVerificationProvider from "@modules/userVerification/provider";
import { ErrorResponse, SuccessResponse } from "@shared/types";
import { AuthenticationError, UserInputError, ValidationError } from "apollo-server-express";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import {
    LoginArgs,
    OTPValidationArgs,
    PhoneNumberArgs,
    ResetPasswordArgs,
    SignUpArgs,
} from "./input";
import AuthenticationProvider from "./provider";
import { AdminAuthenticatedData, AuthenticatedData } from "./types";

@Resolver(of => AuthenticatedData)
export default class AuthenticationResolver {
    // eslint-disable-next-line no-empty-function
    constructor(
      private readonly authenticationProvider: AuthenticationProvider,
      private readonly userProvider: UserProvider,
      private readonly userVerificationProvider: UserVerificationProvider,
    ) {}

    @Query(returns => SuccessResponse)
    app(): SuccessResponse {
        return {
            message:    "Bevel User",
            identifier: `version ${process.env.VERSION}`,
        };
    }

    @Mutation(returns => AuthenticatedData)
    async login(@Arg("loginArgs", returns => LoginArgs) loginArgs: LoginArgs):
        Promise<AuthenticatedData> {
        const response = await this.authenticationProvider.login(loginArgs);

        if (isInstanceOfError(response)) {
            throw new AuthenticationError((response as ErrorResponse).error);
        }

        return response as AuthenticatedData;
    }

    @Mutation(returns => AdminAuthenticatedData)
    async adminLogin(@Arg("loginArgs", returns => LoginArgs) loginArgs: LoginArgs):
        Promise<AdminAuthenticatedData> {
        const response = await this.authenticationProvider.adminLogin(loginArgs);

        if (isInstanceOfError(response)) {
            throw new AuthenticationError((response as ErrorResponse).error);
        }

        return response as AdminAuthenticatedData;
    }

    @Mutation(returns => AuthenticatedData)
    async signUp(@Arg("input", returns => SignUpArgs) signUpArgs: SignUpArgs):
        Promise<AuthenticatedData> {
        if (!process.env.BEVEL_MESSAGING_SERVICE || !process.env.BEVEL_MESSAGING_API_KEY) {
            throw new Error("Internal server error: environment setup");
        }

        // tslint:disable-next-line:tsr-detect-possible-timing-attacks
        if (signUpArgs.password !== signUpArgs.confirmPassword) {
            const error = {
                message:    "incorrect data",
                identifier: signUpArgs.email,
                error:      "password and confirm password does not match",
            };
            throw new ValidationError(error.error);
        }

        const userResponse = await this.userProvider.createUser({
            ...signUpArgs,
            password: getEncryptedPassword(signUpArgs.password),
        });

        if (isInstanceOfError(userResponse)) {
            throw new UserInputError((userResponse as ErrorResponse).error);
        }
        await this.userVerificationProvider.createVerification(userResponse as User);

        this.userVerificationProvider.sendEmailOTP(
            signUpArgs.email,
            signUpArgs.firstName,
            signUpArgs.firstName,
            signUpArgs.lastName,
        );

        return this.login({ email: signUpArgs.email, password: signUpArgs.password });
    }

    @Mutation(returns => SuccessResponse)
    async resentEmailOTP(@Arg("email") email: string): Promise<SuccessResponse> {
        const user = await this.userProvider.getUserByEmail(email);
        if (!user) {
            const error = {
                message:    "User not found",
                identifier: email,
                error:      `User with email: ${email} not found`,
            };
            throw new AuthenticationError(error.error);
        }

        const userVerification = await this.userVerificationProvider.getUserVerification(user.getDataValue("id"));
        if (!userVerification) {
            const error = {
                message:    "UserVerification not found",
                identifier: email,
                error:      `Signup Data corrupt for email: ${email}`,
            };
            throw new AuthenticationError(error.error);
        }
        if (userVerification.getDataValue("isEmailVerified")) {
            const error = {
                message:    "User already verify email",
                identifier: email,
                error:      `Email: ${email} has already been verified`,
            };
            throw new UserInputError(error.error);
        }

        await this.userVerificationProvider.sendEmailOTP(
            email,
            `${user.getDataValue("firstName")} ${user.getDataValue("lastName")}`,
            user.getDataValue("firstName"),
            user.getDataValue("lastName"),
        );

        return {
            message:    "Verification Code has been send to your email",
            identifier: email,
        };
    }

    @Authorized()
    @Mutation(returns => SuccessResponse)
    async authenticatePhoneNumber(@Arg("phoneNumberArgs", returns => PhoneNumberArgs) phoneNumberArgs: PhoneNumberArgs):
        Promise<SuccessResponse> {
        if (!phoneNumberArgs.phoneNumber.startsWith("+")) {
            throw new AuthenticationError("Phone number should contain country code");
        }
        const user = await this.userProvider.getUser(phoneNumberArgs.userId);
        if (!user) {
            const error = {
                message:    "User not found",
                identifier: phoneNumberArgs.userId,
                error:      "User does not exist",
            };
            throw new AuthenticationError(error.error);
        }

        const updatedUserResponse = await this.userProvider.updateUser(
            phoneNumberArgs.userId,
            { phoneNumber: phoneNumberArgs.phoneNumber },
        );

        if (isInstanceOfError(updatedUserResponse)) {
            throw new AuthenticationError((updatedUserResponse as ErrorResponse).error);
        }

        await this.userVerificationProvider.sendPhoneNumberOTP(phoneNumberArgs.phoneNumber);

        return {
            message:    "Verification Code has been send to your phone Number",
            identifier: phoneNumberArgs.phoneNumber,
        };
    }

    @Mutation(returns => SuccessResponse)
    async resetPasswordRequest(
        @Arg("email", { nullable: true }) email?: string,
        @Arg("phoneNumber", { nullable: true }) phoneNumber?: string,
    ): Promise<SuccessResponse> {
        if (!email && !phoneNumber) {
            const error = {
                message:    "Missing parameter",
                identifier: email || phoneNumber || "",
                error:      `User with ${email || phoneNumber}, does not exist`,
            };
            throw new UserInputError(error.error);
        }
        let response: ErrorResponse | null = null;

        if (email) {
            response = await this.authenticationProvider.initiateEmailPasswordResetRequest(email);
        } else if (phoneNumber) {
            response = await this.authenticationProvider.initiatePhoneNumberPasswordResetRequest(phoneNumber);
        }

        if (isInstanceOfError(response)) {
            throw new AuthenticationError((response as ErrorResponse).error);
        }

        return {
            message:    "Password reset code has been sent",
            identifier: email! || phoneNumber!,
        };
    }

    @Mutation(returns => SuccessResponse)
    async resetPassword(@Arg("input", returns => ResetPasswordArgs) input: ResetPasswordArgs):
        Promise<SuccessResponse> {
        const response = await this.authenticationProvider.resetPassword(input.password, input.formToken);

        if (isInstanceOfError(response)) {
            throw new AuthenticationError((response as ErrorResponse).error);
        }

        return {
            message:    "Password reset successful.\nYou can now login",
            identifier: "",
        };
    }

    @Mutation(returns => SuccessResponse)
    async validateResetOTP(@Arg("input", returns => OTPValidationArgs) input: OTPValidationArgs):
        Promise<SuccessResponse> {
        if (!input.email && !input.phoneNumber) {
            const error = {
                message:    "missing input parameters",
                identifier: "phone number or email",
                error:      "Phone Number or Email must be passed",
            };

            throw new ValidationError(error.error);
        }
        const response = await this.authenticationProvider.validateOTP(input);

        if (isInstanceOfError(response)) {
            throw new ValidationError((response as ErrorResponse).error);
        }

        return {
            message:    "OTP successfully validated",
            identifier: response as string,
        };
    }
}
