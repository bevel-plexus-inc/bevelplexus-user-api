import { getEncryptedPassword } from "@lib/authentication";
import { isInstanceOfError } from "@lib/instanceChecker";
import UserArgs, { UserUpdateArgs } from "@modules/user/input";
import { ErrorResponse, GenericRole } from "@shared/types";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Ctx, Mutation, Query, Resolver,
} from "type-graphql";
import UserProvider from "./provider";
import User, { UserAnalytics, UserList, UserRegistrationAnalytics } from "./types";

@Resolver(of => User)
export default class UserResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly userProvider: UserProvider) {}

    @Authorized()
    @Query(returns => User, { nullable: true })
    async user(@Ctx() ctx: { user: User }): Promise<User | null> {
        return this.userProvider.getUser(ctx.user.id);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => User, { nullable: true })
    async userByAdmin(@Arg("id") id: string): Promise<User | null> {
        return this.userProvider.getUser(id);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => UserList)
    async users(
        @Arg("limit", { nullable: true }) limit?: number,
        @Arg("offset", { nullable: true }) offset?: number,
    ): Promise<UserList> {
        return this.userProvider.getUsers(limit, offset);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => UserAnalytics)
    async getUserAnalytics(): Promise<UserAnalytics> {
        return this.userProvider.getUserAnalytics();
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => [UserRegistrationAnalytics])
    async getUserRegistrationAnalytics(): Promise<Array<{ month: string; count: number }>> {
        return this.userProvider.getUserRegistrationAnalytics();
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => User)
    async addUser(@Arg("userArgs", returns => UserArgs) userArgs: UserArgs): Promise<User> {
        const response = await this.userProvider.createUser({
            ...userArgs,
            password: getEncryptedPassword(userArgs.password),
        });
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as User;
    }

    @Authorized()
    @Mutation(returns => User)
    async updatePassword(
        @Arg("userId") userId: string,
        @Arg("oldPassword") oldPassword: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() ctx: { user: User },
    ): Promise<User> {
        const response = await this.userProvider.updatePassword(ctx.user.id, oldPassword, newPassword);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as User;
    }

    @Authorized()
    @Mutation(returns => User)
    async updateUser(
        @Arg("userId") userId: string,
        @Arg("userArgs", returns => UserUpdateArgs) userArgs: UserUpdateArgs,
        @Ctx() ctx: { user: User },
    ): Promise<User> {
        const response = await this.userProvider.updateUser(ctx.user.id, userArgs);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as User;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => User)
    async deleteUser(@Arg("userId") userId: string): Promise<User> {
        const response = await this.userProvider.deactivateUser(userId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as User;
    }

    @Authorized()
    @Mutation(returns => Boolean)
    async requestHelp(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Arg("message") message: string,
    ): Promise<boolean> {
        return this.userProvider.requestHelp(name, email, message);
    }
}
