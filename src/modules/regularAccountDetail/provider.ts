import { Injectable } from "@graphql-modules/di";
import { ErrorResponse } from "@shared/types";
import RegularAccountDetail from "../../models/regularAccountDetail";
import RegularAccountDetailArgs from "./input";

@Injectable()
export default class RegularAccountDetailProvider {
    async getAccountDetails(id: string): Promise<RegularAccountDetail | null> {
        return RegularAccountDetail.findByPk(id);
    }

    async getAccountDetailsByUser(userId: string): Promise<RegularAccountDetail | null> {
        return RegularAccountDetail.findOne({ where: { userId } });
    }

    async getAccountDetailsByUserAndAccount(userId: string, accountId: string): Promise<RegularAccountDetail | null> {
        return RegularAccountDetail.findOne({ where: { userId, id: accountId } });
    }

    async addAccountDetails(accountDetails: RegularAccountDetailArgs): Promise<RegularAccountDetail | ErrorResponse> {
        const existingDetails = await this.getAccountDetailsByUser(accountDetails.userId);

        if (existingDetails) {
            return {
                message:    "record already exist",
                identifier: accountDetails.userId,
                error:      "Account Details with user already exists",
            };
        }

        return RegularAccountDetail.create({
            userId:     accountDetails.userId,
            address:    accountDetails.address,
            city:       accountDetails.city,
            postalCode: accountDetails.postalCode,
            countryId:  accountDetails.countryId,
        });
    }

    async deactivateAccountDetails(userId: string, accountId: string): Promise<RegularAccountDetail | ErrorResponse> {
        const accountDetails = await this.getAccountDetailsByUserAndAccount(userId, accountId);

        if (!accountDetails) {
            return {
                message:    "record not found",
                identifier: accountId,
                error:      "Account Details not found",
            };
        }

        await accountDetails.destroy();

        return accountDetails;
    }
}
