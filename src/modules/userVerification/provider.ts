import { Injectable } from "@graphql-modules/di";
import generateOtpCode from "@lib/generateOtpCode";
import { getEmailVerificationUrl, getHashOTP } from "@lib/getEmailVerificationUrl";
import ConfirmationLog from "@models/confirmationLog";
import EmailOtp from "@models/emailOtp";
import PhoneOtp from "@models/phoneOtp";
import User from "@models/user";
import UserVerification from "@models/userVerification";
import { notificationEmailRequest, notificationSMSRequest } from "@shared/messaging";
import {
    EmailType, ErrorResponse, FileUpload, SuccessResponse,
} from "@shared/types";
import AWS from "aws-sdk";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export default class RegularAccountDetailProvider {
    async createVerification(user: User): Promise<UserVerification> {
        const existingVerification = await UserVerification.findOne({ where: { userId: user.getDataValue("id") } });

        if (existingVerification) {
            await existingVerification.destroy();
        }

        return UserVerification.create({
            userId:   user.getDataValue("id"),
            userType: user.getDataValue("userType"),
        });
    }

    async getUserVerification(userId: string): Promise<UserVerification | null> {
        return UserVerification.findOne({ where: { userId } });
    }

    async uploadUtilityBill(userId: string, file: FileUpload): Promise<UserVerification> {
        const userVerification = await UserVerification.findOne({ where: { userId } });
        if (!userVerification) {
            throw Error("User verification not found");
        }

        userVerification.utilityBillUrl = await this.uploadFile(file);
        // FIXME: remove this when admin is ready
        userVerification.isUtilityBillVerified = true;
        await userVerification.save();

        return userVerification;
    }

    async uploadIdentityDocument(userId: string, file: FileUpload): Promise<UserVerification> {
        const userVerification = await UserVerification.findOne({ where: { userId } });
        if (!userVerification) {
            throw Error("User verification not found");
        }

        userVerification.identityDocumentUrl = await this.uploadFile(file);
        // FIXME: remove this when admin is ready
        userVerification.isIdentityVerified = true;
        await userVerification.save();

        return userVerification;
    }

    async uploadEnrollmentDocument(userId: string, file: FileUpload): Promise<UserVerification> {
        const userVerification = await UserVerification.findOne({ where: { userId } });
        if (!userVerification) {
            throw Error("User verification not found");
        }

        userVerification.enrollmentDocumentUrl = await this.uploadFile(file);
        // FIXME: remove this when admin is ready
        userVerification.isSchoolEnrollmentVerified = true;
        await userVerification.save();

        return userVerification;
    }

    async confirmIdentityDocument(
        userId: string, adminId: string, roleId: string, comment: string,
    ): Promise<UserVerification> {
        const userVerification = await UserVerification.findOne({ where: { userId } });
        if (!userVerification) {
            throw Error("User verification not found");
        }

        await ConfirmationLog.create({
            roleId,
            adminId,
            userId,
            userVerificationId: userVerification.getDataValue("id"),
            documentUrl:        userVerification.getDataValue("utilityBillUrl"),
            comment,
        });
        userVerification.isIdentityVerified = true;
        await userVerification.save();

        return userVerification;
    }

    async confirmEnrollmentDocument(
        userId: string, adminId: string, roleId: string, comment: string,
    ): Promise<UserVerification> {
        const userVerification = await UserVerification.findOne({ where: { userId } });
        if (!userVerification) {
            throw Error("User verification not found");
        }

        await ConfirmationLog.create({
            roleId,
            adminId,
            userId,
            userVerificationId: userVerification.getDataValue("id"),
            documentUrl:        userVerification.getDataValue("enrollmentDocumentUrl"),
            comment,
        });
        userVerification.isSchoolEnrollmentVerified = true;
        await userVerification.save();

        return userVerification;
    }

    async confirmUtilityBill(
        userId: string, adminId: string, roleId: string, comment: string,
    ): Promise<UserVerification> {
        const userVerification = await UserVerification.findOne({ where: { userId } });
        if (!userVerification) {
            throw Error("User verification not found");
        }

        await ConfirmationLog.create({
            roleId,
            adminId,
            userId,
            userVerificationId: userVerification.getDataValue("id"),
            documentUrl:        userVerification.getDataValue("utilityBillUrl"),
            comment,
        });
        if (
            userVerification.getDataValue("isPhoneNumberVerified")
            && userVerification.getDataValue("isEmailVerified")
            && userVerification.getDataValue("level") === 2
        ) {
            userVerification.level = 3;
        }
        userVerification.isUtilityBillVerified = true;
        await userVerification.save();

        return userVerification;
    }

    async verifyEmail(user: User, token: string): Promise<ErrorResponse | SuccessResponse> {
        const userVerification = await UserVerification.findOne({ where: { userId: user.id } });
        if (!userVerification) {
            return {
                message:    "Data Corruption",
                identifier: user.id,
                error:      "Internal server error: user verification data corrupt",
            };
        }

        const emailOtp = await EmailOtp.findOne({
            where: {
                email: user.email,
                otp:   token,
            },
        });
        if (!emailOtp) {
            return {
                message:    "Invalid Otp code",
                identifier: user.email,
                error:      "Verification link invalid",
            };
        }
        if (moment.utc(emailOtp.getDataValue("updatedAt")).add(30, "minutes").isBefore(moment.utc())) {
            return {
                message:    "Expired Otp code",
                identifier: user.email,
                error:      "Verification link expired",
            };
        }

        await emailOtp.destroy();
        await userVerification.update({ isEmailVerified: true });

        this.sendSignupEmail(user.email, user.firstName, user.firstName, user.lastName);

        return {
            message:    "Email verification successful",
            identifier: user.email,
        };
    }

    async verifyPhoneNumber(user: User, token: string): Promise<ErrorResponse | SuccessResponse> {
        const userVerification = await UserVerification.findOne({ where: { userId: user.getDataValue("id") } });
        if (!userVerification) {
            return {
                message:    "Data Corruption",
                identifier: user.getDataValue("id"),
                error:      "Internal server error: user verification data corrupt",
            };
        }

        const phoneOtp = await PhoneOtp.findOne({
            where: {
                phoneNumber: user.getDataValue("phoneNumber"),
                otp:         token,
            },
        });

        if (!phoneOtp) {
            return {
                message:    "Invalid Otp code",
                identifier: user.getDataValue("phoneNumber"),
                error:      "Otp invalid",
            };
        }

        await phoneOtp.destroy();
        await userVerification.update({ isPhoneNumberVerified: true });

        return {
            message:    "Phone number verification successful",
            identifier: user.getDataValue("phoneNumber"),
        };
    }

    sendSignupEmail(email: string, name: string, firstName: string, lastName: string): void {
        notificationEmailRequest({
            emailType:  EmailType.SignUpSuccess,
            parameters: {
                receivers: [
                    {
                        name, email, firstName, lastName,
                    },
                ],
            },
        });
    }

    async sendEmailOTP(email: string, name: string, firstName: string, lastName: string): Promise<void> {
        const existingEmailOTP = await EmailOtp.findOne({ where: { email } });
        const otp = generateOtpCode();
        const hashedOtp = getHashOTP(otp);

        if (existingEmailOTP) {
            existingEmailOTP.otp = hashedOtp;
            await existingEmailOTP.save();
        } else {
            await EmailOtp.create({
                email,
                otp: hashedOtp,
            });
        }

        notificationEmailRequest({
            emailType:  EmailType.EmailVerification,
            parameters: {
                verificationUrl: getEmailVerificationUrl(email, hashedOtp),
                receivers:       [
                    {
                        name, email, firstName, lastName,
                    },
                ],
            },
        });
    }

    async sendPhoneNumberOTP(phoneNumber: string): Promise<void> {
        const existingPhoneOTP = await PhoneOtp.findOne({ where: { phoneNumber } });

        const otp = generateOtpCode();
        if (existingPhoneOTP) {
            existingPhoneOTP.otp = otp;
            await existingPhoneOTP.save();
        } else {
            await PhoneOtp.create({
                phoneNumber,
                otp,
            });
        }

        notificationSMSRequest({ phoneNumber, body: `${otp} is your Bevel Plexus OTP. Do not share it with anyone` });
    }

    async uploadFile(file: FileUpload): Promise<string> {
        const {
            AWS_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION,
        } = process.env;

        if (!AWS_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
            throw new Error("Internal server error: environment setup");
        }

        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        const fileSplit = filename.split(".");
        const fileName = `${uuidv4()}.${fileSplit[(fileSplit.length - 1)]}`;

        AWS.config.update({
            region:          AWS_REGION,
            accessKeyId:     AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3();
        const response: { Location: string } = await s3.upload({
            Bucket: AWS_BUCKET_NAME,
            Body:   stream,
            Key:    fileName,
        }).promise();

        return response.Location;
    }
}
