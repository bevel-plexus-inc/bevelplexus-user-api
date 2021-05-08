import { Injectable } from "@graphql-modules/di";
import {
    getEncryptedPassword, getToken, isPasswordEqual, isTokenExpired,
} from "@lib/authentication";
import generateOtpCode from "@lib/generateOtpCode";
import AccountResetUser from "@models/accountResetUser";
import Admin from "@models/admin";
import BankInfo from "@models/bankInfo";
import Recipient from "@models/recipient";
import RegularAccountDetail from "@models/regularAccountDetail";
import Role from "@models/role";
import StudentAccountDetail from "@models/studentAccountDetail";
import User from "@models/user";
import UserKyc from "@models/userKyc";
import UserVerification from "@models/userVerification";
import { getCountry } from "@shared/country";
import { getInstitution } from "@shared/institution";
import { notificationEmailRequest, notificationSMSRequest } from "@shared/messaging";
import { EmailType, ErrorResponse, UserType } from "@shared/types";
import moment from "moment";
import sentryHttpLogger from "@lib/sentryHttpLogger";
import { LoginArgs, OTPValidationArgs } from "./input";
import { AdminAuthenticatedData, AuthenticatedData } from "./types";

@Injectable()
export default class AuthenticationProvider {
    async login(loginArgs: LoginArgs): Promise<AuthenticatedData | ErrorResponse> {
        const user = await User.findOne({
            where:   { email: loginArgs.email },
            include: [
                {
                    model: StudentAccountDetail,
                    as:    "studentAccountDetail",
                },
                {
                    model: RegularAccountDetail,
                    as:    "regularAccountDetail",
                },
                {
                    model: UserVerification,
                    as:    "userVerification",
                },
                {
                    model:   Recipient,
                    as:      "recipient",
                    include: [
                        {
                            model: BankInfo,
                            as:    "bankInfo",
                        },
                    ],
                },
                {
                    model: UserKyc,
                    as:    "userKyc",
                },
            ],
        });

        if (!user) {
            return {
                message:    "record does not exist",
                identifier: loginArgs.email,
                error:      "Login credentials does not match",
            };
        }

        if (!isPasswordEqual(loginArgs.password, user.getDataValue("password"))) {
            return {
                message:    "incorrect credentials",
                identifier: loginArgs.email,
                error:      "Login credentials does not match",
            };
        }

        if (user.getDataValue("userType") === UserType.Regular && user.regularAccountDetail) {
            user.regularAccountDetail.country = await getCountry(user.regularAccountDetail.getDataValue("countryId"));
        }

        if (user.getDataValue("userType") === UserType.Student && user.studentAccountDetail) {
            user.studentAccountDetail.institution = await getInstitution(
                user.studentAccountDetail.getDataValue("institutionId"),
            );
        }

        return {
            user,
            token: getToken({
                id:        user.getDataValue("id"),
                // eslint-disable-next-line no-nested-ternary
                countryId: user.regularAccountDetail
                    ? user.regularAccountDetail.getDataValue("countryId")
                    : user.studentAccountDetail
                        ? user.studentAccountDetail.getDataValue("countryId")
                        : "",
            }),
        };
    }

    async adminLogin(loginArgs: LoginArgs): Promise<AdminAuthenticatedData | ErrorResponse> {
        const admin = await Admin.findOne({
            where:   { email: loginArgs.email },
            include: [
                {
                    model: Role,
                    as:    "role",
                },
            ],
        });

        if (!admin) {
            return {
                message:    "record does not exist",
                identifier: loginArgs.email,
                error:      "Login credentials does not match",
            };
        }

        if (!isPasswordEqual(loginArgs.password, admin.getDataValue("password"))) {
            return {
                message:    "incorrect credentials",
                identifier: loginArgs.email,
                error:      "Login credentials does not match",
            };
        }

        sentryHttpLogger(new Error("Logging"), {
            method:      "GRAPHQL",
            body:        JSON.stringify(admin),
            originalUrl: "admin.login",
        });

        return {
            admin,
            token: getToken({
                id:        admin.getDataValue("id"),
                countryId: "",
                role:      admin.role.name,
            }),
        };
    }

    async resetPassword(password: string, formToken: string): Promise<ErrorResponse | null> {
        const accountReset = await AccountResetUser.findOne({ where: { formToken } });
        if (!accountReset) {
            return {
                message:    "Incorrect form token",
                identifier: "",
                error:      "Form token invalid",
            };
        }
        if (isTokenExpired(formToken)) {
            return {
                message:    "Session expired",
                identifier: "",
                error:      "Form session expired, request a new token",
            };
        }

        const user = await User.findOne({ where: { email: accountReset.getDataValue("email") } });
        if (!user) {
            return {
                message:    "incorrect credentials",
                identifier: "",
                error:      "Account to reset not found",
            };
        }

        // FIXME: implement transaction
        await user.update({ password: getEncryptedPassword(password) });
        await accountReset.destroy({ force: true });

        return null;
    }

    async initiateEmailPasswordResetRequest(email: string): Promise<ErrorResponse | null> {
        const user = await User.findOne({
            where: { email },
            raw:   true,
        });

        if (!user) {
            return {
                message:    "record not found",
                identifier: email,
                error:      `No account found with email: ${email}`,
            };
        }
        const otp = await this.saveResetData(user);

        notificationEmailRequest({
            emailType:  EmailType.ResetPassword,
            parameters: {
                otp:       otp.toUpperCase(),
                receivers: [{
                    name:      user.firstName,
                    firstName: user.firstName,
                    lastName:  user.lastName,
                    email:     user.email,
                }],
            },
        });

        return null;
    }

    async initiatePhoneNumberPasswordResetRequest(phoneNumber: string): Promise<ErrorResponse | null> {
        const user = await User.findOne({
            where: { phoneNumber },
            raw:   true,
        });

        if (!user) {
            return {
                message:    "record not found",
                identifier: phoneNumber,
                error:      `No account found with phone number: ${phoneNumber}`,
            };
        }
        const otp = await this.saveResetData(user);

        notificationSMSRequest({ phoneNumber: user.phoneNumber, body: otp.toUpperCase() });

        return null;
    }

    async saveResetData(user: User): Promise<string> {
        const existingReset = await AccountResetUser.findOne({ where: { userId: user.id } });

        if (existingReset) {
            await existingReset.destroy();
        }

        const otp = generateOtpCode();

        const expiringDays = 3;
        await AccountResetUser.create({
            token:        otp,
            email:        user.email,
            phoneNumber:  user.phoneNumber,
            userId:       user.id,
            expiringDate: moment.utc().add(expiringDays, "days").toDate(),
        });

        return otp;
    }

    async validateOTP(input: OTPValidationArgs): Promise<ErrorResponse | string> {
        if (!input.email && !input.phoneNumber) {
            return {
                message:    "missing input parameters",
                identifier: "phone number or email",
                error:      "Phone Number or Email must be passed",
            };
        }

        let resetAccount: AccountResetUser | null = null;

        if (input.email) {
            resetAccount = await AccountResetUser.findOne({
                where: {
                    email: input.email,
                    token: input.otp,
                },
            });
        } else if (input.phoneNumber) {
            resetAccount = await AccountResetUser.findOne({
                where: {
                    phoneNumber: input.phoneNumber,
                    token:       input.otp,
                },
            });
        }

        if (!resetAccount) {
            return {
                message:    "validation failed",
                identifier: input.otp,
                error:      `The OTP ${input.otp} is invalid`,
            };
        }

        if (moment.utc(resetAccount.getDataValue("expiringDate")).isBefore(moment.utc())) {
            await resetAccount.destroy();

            return {
                message:    "validation failed",
                identifier: input.otp,
                error:      `The OTP ${input.otp} is expired and hence removed`,
            };
        }

        const id = resetAccount.getDataValue("id");
        const formToken = getToken({ id, countryId: "" });
        await resetAccount.update({ formToken });

        return formToken;
    }
}
