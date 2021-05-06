import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse } from "@shared/types";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Ctx, Mutation, Query, Resolver,
} from "type-graphql";
import RegularAccountDetailArgs from "./input";
import RegularAccountDetailProvider from "./provider";
import RegularAccountDetail from "./types";
import User from "@modules/user/types";

@Resolver(of => RegularAccountDetail)
export default class RegularAccountDetailResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly regularAccountDetailProvider: RegularAccountDetailProvider) {}

    @Authorized()
    @Query(returns => RegularAccountDetail, { nullable: true })
    async regularAccountDetails(@Arg("id") id: string): Promise<RegularAccountDetail | null> {
        return this.regularAccountDetailProvider.getAccountDetails(id);
    }

    @Authorized()
    @Query(returns => RegularAccountDetail, { nullable: true })
    async regularAccountDetailsByUser(@Arg("userId") userId: string):
        Promise<RegularAccountDetail | null> {
        return this.regularAccountDetailProvider.getAccountDetailsByUser(userId);
    }

    @Authorized()
    @Mutation(returns => RegularAccountDetail)
    async addRegularAccountDetails(@Arg("accountDetails", returns => RegularAccountDetailArgs)
        accountDetails: RegularAccountDetailArgs): Promise<RegularAccountDetail> {
        const response = await this.regularAccountDetailProvider.addAccountDetails(accountDetails);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as RegularAccountDetail;
    }

    @Authorized()
    @Mutation(returns => RegularAccountDetail)
    async deactivateRegularAccountDetails(
        @Arg("id") id: string,
        @Ctx() ctx: { user: User },
    ): Promise<RegularAccountDetail> {
        const response = await this.regularAccountDetailProvider.deactivateAccountDetails(ctx.user.id, id);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as RegularAccountDetail;
    }
}
