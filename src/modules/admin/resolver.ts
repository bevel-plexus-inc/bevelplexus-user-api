import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole } from "@shared/types";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Ctx, Mutation, Query, Resolver,
} from "type-graphql";
import AdminArgs from "./input";
import AdminProvider from "./provider";
import Admin from "./types";

@Resolver(of => Admin)
export default class AdminResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly adminProvider: AdminProvider) {}

    @Authorized(GenericRole.Admin)
    @Query(returns => Admin, { nullable: true })
    async getAdmin(@Arg("adminId") adminId: string): Promise<Admin | null> {
        return this.adminProvider.getAdmin(adminId);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => [Admin])
    async getAdmins(): Promise<Array<Admin>> {
        return this.adminProvider.getAdmins();
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Admin)
    async createAdmin(@Arg("adminArgs", returns => AdminArgs) adminArgs: AdminArgs): Promise<Admin> {
        const response = await this.adminProvider.createAdmin(adminArgs);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Admin;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Admin)
    async updateAdmin(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Ctx() ctx: { admin: Admin },
    ): Promise<Admin> {
        const response = await this.adminProvider.updateAdmin(ctx.admin.id, name, email);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Admin;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Admin)
    async activateAdmin(@Arg("adminId") adminId: string): Promise<Admin> {
        const response = await this.adminProvider.activateAdmin(adminId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Admin;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Admin)
    async deactivateAdmin(@Arg("adminId") adminId: string): Promise<Admin> {
        const response = await this.adminProvider.deactivateAdmin(adminId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Admin;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Admin)
    async deleteAdmin(@Arg("adminId") adminId: string): Promise<Admin> {
        const response = await this.adminProvider.deleteAdmin(adminId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Admin;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Admin)
    async updateAdminPassword(
        @Arg("oldPassword") oldPassword: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() ctx: { admin: Admin },
    ): Promise<Admin> {
        const response = await this.adminProvider.updatePassword(ctx.admin.id, oldPassword, newPassword);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Admin;
    }
}
