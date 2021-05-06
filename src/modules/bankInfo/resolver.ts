import { isInstanceOfError } from "@lib/instanceChecker";
import BankInfoArgs from "@modules/bankInfo/input";
import { ErrorResponse } from "@shared/types";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import BankInfoProvider from "./provider";
import BankInfo from "./types";

@Resolver(of => BankInfo)
export default class BankInfoResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly bankInfoProvider: BankInfoProvider) {}

    @Authorized()
    @Query(returns => [BankInfo])
    async bankInfoByRecipient(@Arg("recipientId") recipientId: string): Promise<Array<BankInfo>> {
        return this.bankInfoProvider.getBankInfoByRecipient(recipientId);
    }

    @Authorized()
    @Query(returns => BankInfo, { nullable: true })
    async bankInfo(@Arg("id") id: string): Promise<BankInfo | null> {
        return this.bankInfoProvider.getBankInfo(id);
    }

    @Authorized()
    @Mutation(returns => BankInfo)
    async addBankInfo(@Arg("bankInfoArgs", returns => BankInfoArgs) bankInfoArgs: BankInfoArgs):
        Promise<BankInfo> {
        const response = await this.bankInfoProvider.createBankInfo(bankInfoArgs);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as BankInfo;
    }

    @Authorized()
    @Mutation(returns => BankInfo)
    async updateBankInfo(
        @Arg("bankInfoId") bankInfoId: string,
        @Arg("bankInfoArgs", returns => BankInfoArgs) bankInfoArgs: BankInfoArgs,
    ): Promise<BankInfo> {
        const response = await this.bankInfoProvider.updateBankInfo(bankInfoId, bankInfoArgs);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as BankInfo;
    }

    @Authorized()
    @Mutation(returns => BankInfo)
    async deleteBankInfo(@Arg("bankInfoId") bankInfoId: string): Promise<BankInfo> {
        const response = await this.bankInfoProvider.deactivateBankInfo(bankInfoId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as BankInfo;
    }
}
