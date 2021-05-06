import User from "@modules/user/types";
import { GenericRole } from "@shared/types";
import {
    Arg, Authorized, Ctx, Query, Resolver,
} from "type-graphql";
import UserKycProvider from "./provider";
import UserKyc from "./types";

@Resolver(of => UserKyc)
export default class UserKycResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly userKycProvider: UserKycProvider) {}

    @Authorized()
    @Query(returns => UserKyc, { nullable: true })
    async getUserKyc(
        @Arg("userId") userId: string,
        @Ctx() ctx: { user: User },
    ): Promise<UserKyc | null> {
        return this.userKycProvider.getUserKyc(ctx.user.id);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => UserKyc, { nullable: true })
    async adminGetUserKyc(@Arg("userId") userId: string): Promise<UserKyc | null> {
        return this.userKycProvider.getUserKyc(userId);
    }
}
