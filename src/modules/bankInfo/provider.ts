import { Injectable } from "@graphql-modules/di";
import { ErrorResponse } from "@shared/types";
import BankInfo from "../../models/bankInfo";
import BankInfoArgs, { BankInfoUpdateArgs } from "./input";

@Injectable()
export default class BankInfoProvider {
    async getBankInfoByRecipient(recipientId: string): Promise<Array<BankInfo>> {
        return BankInfo.findAll({
            where: { recipientId },
            order: [["createdAt", "DESC"]],
        });
    }

    async getBankInfo(id: string): Promise<BankInfo | null> {
        return BankInfo.findByPk(id);
    }

    async createBankInfo(bankInfoArgs: BankInfoArgs): Promise<BankInfo | ErrorResponse> {
        return BankInfo.create({
            bank:              bankInfoArgs.bank,
            bankCode:          bankInfoArgs.bankCode,
            accountNumber:     bankInfoArgs.accountNumber,
            recipientId:       bankInfoArgs.recipientId,
            transitOrSortCode: bankInfoArgs.transitOrSortCode,
        });
    }

    async updateBankInfo(bankInfoId: string, bankInfoArgs: BankInfoUpdateArgs): Promise<BankInfo | ErrorResponse> {
        const bankInfo = await this.getBankInfo(bankInfoId);
        if (!bankInfo) {
            return {
                message:    "record not found",
                identifier: bankInfoId,
                error:      `BankInfo with id: ${bankInfoId} does not exist`,
            };
        }

        bankInfo.bank = bankInfoArgs.bank;
        bankInfo.bankCode = bankInfoArgs.bankCode;
        bankInfo.accountNumber = bankInfoArgs.accountNumber;
        bankInfo.transitOrSortCode = bankInfoArgs.transitOrSortCode;
        await bankInfo.save();

        return bankInfo;
    }

    async deactivateBankInfo(bankInfoId: string): Promise<BankInfo | ErrorResponse> {
        const bankInfo = await this.getBankInfo(bankInfoId);
        if (!bankInfo) {
            return {
                message:    "record not found",
                identifier: bankInfoId,
                error:      `BankInfo with id: ${bankInfoId} does not exist`,
            };
        }

        await bankInfo.destroy();

        return bankInfo;
    }
}
