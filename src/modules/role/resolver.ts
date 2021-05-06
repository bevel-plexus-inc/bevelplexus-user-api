import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole } from "@shared/types";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import RoleProvider from "./provider";
import Role from "./types";

@Resolver(of => Role)
export default class RoleResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly roleProvider: RoleProvider) {}

    @Authorized(GenericRole.Admin)
    @Query(returns => Role, { nullable: true })
    async getRole(@Arg("roleId") roleId: string): Promise<Role | null> {
        return this.roleProvider.getRole(roleId);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => [Role])
    async getRoles(): Promise<Array<Role>> {
        return this.roleProvider.getRoles();
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Role)
    async createRole(@Arg("name") name: string): Promise<Role> {
        return this.roleProvider.createRole(name);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => Role)
    async activateRole(@Arg("roleId") roleId: string): Promise<Role> {
        const response = await this.roleProvider.activateRole(roleId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Role;
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => Role)
    async deactivateRole(@Arg("roleId") roleId: string): Promise<Role> {
        const response = await this.roleProvider.deactivateRole(roleId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Role;
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => Role)
    async updateRole(
        @Arg("roleId") roleId: string,
        @Arg("name") name: string,
    ): Promise<Role> {
        const response = await this.roleProvider.updateRole(roleId, name);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as Role;
    }
}
