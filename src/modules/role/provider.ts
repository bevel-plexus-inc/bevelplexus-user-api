import { Injectable } from "@graphql-modules/di";
import Role from "@models/role";
import { ErrorResponse } from "@shared/types";

@Injectable()
export default class RoleProvider {
    async getRole(roleId: string): Promise<Role | null> {
        return Role.findByPk(roleId, { paranoid: false });
    }

    async getRoles(): Promise<Array<Role>> {
        return Role.findAll({
            order:    [["createdAt", "DESC"]],
            paranoid: false,
        });
    }

    async createRole(name: string): Promise<Role> {
        return Role.create({ name });
    }

    async updateRole(roleId: string, name: string): Promise<Role | ErrorResponse> {
        const role = await this.getRole(roleId);
        if (!role) {
            return {
                message:    "record not found",
                identifier: roleId,
                error:      "Role does not exist",
            };
        }

        role.name = name;
        await role.save();

        return role;
    }

    async deactivateRole(roleId: string): Promise<Role | ErrorResponse> {
        const role = await this.getRole(roleId);
        if (!role) {
            return {
                message:    "record not found",
                identifier: roleId,
                error:      "Role does not exist",
            };
        }

        await role.destroy();

        return role;
    }

    async activateRole(roleId: string): Promise<Role | ErrorResponse> {
        const role = await this.getRole(roleId);
        if (!role) {
            return {
                message:    "record not found",
                identifier: roleId,
                error:      "Role does not exist",
            };
        }

        await role.restore();

        return role;
    }
}
