import { Injectable } from "@graphql-modules/di";
import { ErrorResponse } from "@shared/types";
import axios from "axios";
import sentryHttpLogger from "../../lib/sentryHttpLogger";
import User from "../../models/user";
import UserKyc from "../../models/userKyc";
import { transactionCreateAccount } from "../../shared/transaction";

@Injectable()
export default class RegularAccountDetailProvider {
    async verifyKyc(userId: string): Promise<ErrorResponse | string> {
        const { KYC_CLIENT_URL, KYC_TOKEN } = process.env;
        if (!KYC_CLIENT_URL || !KYC_TOKEN) {
            return {
                message:    "missing environmental variables",
                identifier: userId,
                error:      "Internal server error: environmental setup",
            };
        }

        try {
            const kycData = await axios.get(KYC_CLIENT_URL, { headers: { Authorization: `Bearer ${KYC_TOKEN}` } });
            if (kycData.status === 200) {
                // eslint-disable-next-line camelcase
                const { url, ref_id } = kycData.data;
                await UserKyc.create({
                    userId,
                    referenceId: ref_id,
                });

                return url;
            }

            return {
                message:    "kyc service failed",
                identifier: userId,
                error:      "Error with KYC service",
            };
        } catch (e) {
            sentryHttpLogger(e, {
                method:      "GET",
                originalUrl: KYC_CLIENT_URL,
                body:        userId,
            });

            return {
                message:    "kyc service failed",
                identifier: userId,
                error:      "Error with KYC service",
            };
        }
    }

    async getUserKyc(userId: string): Promise<UserKyc | null> {
        return UserKyc.findOne({ where: { userId } });
    }

    // eslint-disable-next-line camelcase
    async saveKycVerification(response: { data: { matchLevel: number; ref_id: string; }; }):
        Promise<ErrorResponse | null> {
        const { matchLevel, ref_id: referenceId } = response.data;
        if (!matchLevel || !referenceId) {
            return {
                message:    "data corrupted",
                identifier: "",
                error:      "response doesn't contain the needed data",
            };
        }

        const kyc = await UserKyc.findOne({ where: { referenceId } });
        if (!kyc) {
            return {
                message:    "kyc record not found",
                identifier: "",
                error:      "kyc record not found",
            };
        }

        const user = await User.findByPk(kyc.getDataValue("userId"), { raw: true });
        if (!user) {
            return {
                message:    "user record not found",
                identifier: "",
                error:      "user record not found",
            };
        }

        await kyc.update({
            matchLevel,
            isVerified: true,
        });

        transactionCreateAccount({
            userId:    kyc.getDataValue("userId"),
            email:     user.email,
            firstName: user.firstName,
            lastName:  user.lastName,
        });

        return null;
    }
}
