import { isInstanceOfError } from "@lib/instanceChecker";
import RecipientArgs from "@modules/recipient/input";
import User from "@modules/user/types";
import { ErrorResponse, GenericRole } from "@shared/types";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Ctx, Mutation, Query, Resolver,
} from "type-graphql";
import RecipientProvider from "./provider";
import Recipient, { RecipientList } from "./types";

@Resolver(of => Recipient)
export default class RecipientResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly recipientProvider: RecipientProvider) {}

    @Authorized()
    @Query(returns => RecipientList)
    async recipientByUser(
        @Arg("limit") limit: number,
        @Arg("offset") offset: number,
        @Ctx() ctx: { user: User },
    ): Promise<RecipientList> {
        return this.recipientProvider.getRecipientByUser(ctx.user.id, limit, offset);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => RecipientList)
    async getAllRecipient(
        @Arg("limit") limit: number,
        @Arg("offset") offset: number,
    ): Promise<RecipientList> {
        return this.recipientProvider.getAllRecipient(limit, offset);
    }

    @Authorized()
    @Query(returns => [Recipient])
    async getRecipientsByIds(@Arg("recipientIds", returns => [String!]!) recipientIds: Array<string>):
        Promise<Array<Recipient>> {
        return this.recipientProvider.getRecipientsByIds(recipientIds);
    }

    @Authorized()
    @Query(returns => Recipient, { nullable: true })
    async recipient(@Arg("id") id: string): Promise<Recipient | null> {
        return this.recipientProvider.getRecipient(id);
    }

    @Authorized()
    @Mutation(returns => Recipient)
    async addRecipient(
        @Arg("recipientArgs", returns => RecipientArgs) recipientArgs: RecipientArgs,
        @Ctx() ctx: { user: User },
    ): Promise<Recipient> {
        const response = await this.recipientProvider.createRecipient(recipientArgs, ctx.user.id);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Recipient;
    }

    @Authorized()
    @Mutation(returns => Recipient)
    async updateRecipient(
        @Arg("recipientId") recipientId: string,
        @Arg("recipientArgs", returns => RecipientArgs) recipientArgs: RecipientArgs,
        @Ctx() ctx: { user: User },
    ): Promise<Recipient> {
        const response = await this.recipientProvider.updateRecipient(ctx.user.id, recipientId, recipientArgs);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Recipient;
    }

    @Authorized()
    @Mutation(returns => Recipient)
    async deleteRecipient(
        @Arg("recipientId") recipientId: string,
        @Ctx() ctx: { user: User },
    ): Promise<Recipient> {
        const response = await this.recipientProvider.deactivateRecipient(ctx.user.id, recipientId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Recipient;
    }
}
