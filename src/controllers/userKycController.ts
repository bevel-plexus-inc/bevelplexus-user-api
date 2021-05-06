import sentryHttpLogger from "@lib/sentryHttpLogger";
import User from "@models/user";
import UserKyc from "@models/userKyc";
import UserVerification from "@models/userVerification";
import * as Sentry from "@sentry/node";
import { notificationEmailRequest } from "@shared/messaging";
import { EmailType } from "@shared/types";
import { autobind } from "core-decorators";
import { Request, Response } from "express";

export default class UserKYCController {
    @autobind
    async saveKycVerification(req: Request, res: Response): Promise<Response> {
        try {
            // sentryHttpLogger(new Error(`dumping ${JSON.stringify(req.params)}`), req, Sentry.Severity.Debug);
            if (!req.body) {
                const errorMessage = "Missing necessary parameters: data";
                sentryHttpLogger(new Error(errorMessage), req, Sentry.Severity.Debug);

                return res.status(400).json({ message: errorMessage });
            }
            if (!req.params.userId) {
                const errorMessage = "Missing userid in path param";
                sentryHttpLogger(new Error(errorMessage), req, Sentry.Severity.Debug);

                return res.status(400).json({ message: errorMessage });
            }

            const {
                completed, status, result, id,
            } = req.body;
            if (!completed) {
                const errorMessage = "response doesn't contain the needed data: completed";
                sentryHttpLogger(new Error(errorMessage), req, Sentry.Severity.Debug);

                return res.status(400).json({ message: errorMessage });
            }
            if (!status) {
                const errorMessage = "response doesn't contain the needed data: status";
                sentryHttpLogger(new Error(errorMessage), req, Sentry.Severity.Debug);

                return res.status(400).json({ message: errorMessage });
            }
            if (!result || !result.success) {
                const errorMessage = "response doesn't contain the needed data: result";
                sentryHttpLogger(new Error(errorMessage), req, Sentry.Severity.Debug);

                return res.status(400).json({ message: errorMessage });
            }
            if (!id) {
                const errorMessage = "response doesn't contain the needed data: id";
                sentryHttpLogger(new Error(errorMessage), req, Sentry.Severity.Debug);

                return res.status(400).json({ message: errorMessage });
            }

            const kyc = await UserKyc.findOne({ where: { userId: req.params.userId } });
            if (!kyc) {
                const errorMessage = `kyc record for the user id ${req.params.userId} not found`;
                sentryHttpLogger(new Error(errorMessage), req, Sentry.Severity.Debug);

                return res.status(404).json({ message: errorMessage });
            }
            const user = await User.findByPk(kyc.getDataValue("userId"), { raw: true });
            if (!user) {
                const errorMessage = `kyc record for the user id ${req.params.userId} not found`;
                sentryHttpLogger(new Error(errorMessage), req, Sentry.Severity.Debug);

                return res.status(404).json({ message: errorMessage });
            }
            const userVerification = await UserVerification.findOne({ where: { userId: kyc.getDataValue("userId") } });
            if (!userVerification) {
                const errorMessage = `User verification record for the user id ${kyc.getDataValue("userId")} not found`;
                sentryHttpLogger(new Error(errorMessage), req, Sentry.Severity.Debug);

                return res.status(404).json({ message: errorMessage });
            }

            kyc.status = status;
            kyc.isVerified = result.success;
            kyc.jobId = id;
            if (
                userVerification.getDataValue("isPhoneNumberVerified")
                && userVerification.getDataValue("isEmailVerified")
            ) {
                userVerification.level = 2;
                await userVerification.save();
            }
            // kyc.result = JSON.stringify(result);
            await kyc.save();

            notificationEmailRequest({
                emailType:  EmailType.KYCVerificationSuccess,
                parameters: {
                    receivers: [{
                        name:      user.firstName,
                        firstName: user.firstName,
                        lastName:  user.lastName,
                        email:     user.email,
                    }],
                },
            });

            return res.status(200).json({ userKyc: true });
        } catch (e) {
            sentryHttpLogger(e, req);

            return res.status(500).json({ message: "System Error" });
        }
    }
}
