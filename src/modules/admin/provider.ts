import { Injectable } from "@graphql-modules/di";
import { getEncryptedPassword, isPasswordEqual } from "@lib/authentication";
import Admin from "@models/admin";
import Role from "@models/role";
import { ErrorResponse } from "@shared/types";
import { Op } from "sequelize";
import AdminArgs from "./input";

@Injectable()
export default class AdminProvider {
    async getAdmin(adminId: string): Promise<Admin | null> {
        return Admin.findByPk(adminId, {
            include: [
                {
                    model: Role,
                    as:    "role",
                },
            ],
            paranoid: false,
        });
    }

    async getAdminByEmail(email: string): Promise<Admin | null> {
        return Admin.findOne({
            where:   { email },
            include: [
                {
                    model: Role,
                    as:    "role",
                },
            ],
            paranoid: false,
        });
    }

    async getAdmins(): Promise<Array<Admin>> {
        return Admin.findAll({
            include: [
                {
                    model: Role,
                    as:    "role",
                },
            ],
            paranoid: false,
            order:    [["createdAt", "DESC"]],
        });
    }

    async updatePassword(adminId: string, oldPassword: string, newPassword: string): Promise<Admin | ErrorResponse> {
        const admin = await this.getAdmin(adminId);
        if (!admin) {
            return {
                message:    "record not found",
                identifier: adminId,
                error:      "Admin not found",
            };
        }

        if (!isPasswordEqual(oldPassword, admin.getDataValue("password"))) {
            return {
                message:    "incorrect password",
                identifier: adminId,
                error:      "Old password is not correct",
            };
        }

        admin.password = getEncryptedPassword(newPassword);
        await admin.save();

        return admin;
    }

    async createAdmin(adminArgs: AdminArgs): Promise<Admin | ErrorResponse> {
        const existingAdminEmail = await this.getAdminByEmail(adminArgs.email);
        if (existingAdminEmail) {
            return {
                message:    "record already exist",
                identifier: adminArgs.email,
                error:      `Admin with email: ${adminArgs.email}, already exists`,
            };
        }

        await Admin.create({
            name:     adminArgs.name,
            roleId:   adminArgs.roleId,
            email:    adminArgs.email,
            password: getEncryptedPassword(adminArgs.password),
        }, {
            include: [
                {
                    model: Role,
                    as:    "role",
                },
            ],
        });
        const admin = this.getAdminByEmail(adminArgs.email);
        if (!admin) {
            return {
                message:    "record already exist",
                identifier: adminArgs.email,
                error:      `Admin with email: ${adminArgs.email}, already exists`,
            };
        }

        return admin as unknown as Admin;
    }

    async fetchAdminWithExclusion(email: string, userId: string): Promise<Admin | null> {
        return Admin.findOne({
            where: {
                email,
                [Op.not]: [
                    { id: userId },
                ],
            },
            include: [
                {
                    model: Role,
                    as:    "role",
                },
            ],
            paranoid: false,
        });
    }

    async updateAdmin(adminId: string, name: string, email: string): Promise<Admin | ErrorResponse> {
        const admin = await this.getAdmin(adminId);
        if (!admin) {
            return {
                message:    "record not found",
                identifier: adminId,
                error:      "Admin does not exist",
            };
        }

        const existingAdminEmail = await this.fetchAdminWithExclusion(email, adminId);
        if (existingAdminEmail) {
            return {
                message:    "record already exist",
                identifier: email,
                error:      `Another admin with email: ${email}, already exists`,
            };
        }

        admin.name = name;
        admin.email = email;

        await admin.save();

        return admin;
    }

    async deactivateAdmin(adminId: string): Promise<Admin | ErrorResponse> {
        const admin = await this.getAdmin(adminId);
        if (!admin) {
            return {
                message:    "record not found",
                identifier: adminId,
                error:      "Admin does not exist",
            };
        }

        await admin.destroy();

        return admin;
    }

    async deleteAdmin(adminId: string): Promise<Admin | ErrorResponse> {
        const admin = await this.getAdmin(adminId);
        if (!admin) {
            return {
                message:    "record not found",
                identifier: adminId,
                error:      "Admin does not exist",
            };
        }

        await admin.destroy({ force: true });

        return admin;
    }

    async activateAdmin(adminId: string): Promise<Admin | ErrorResponse> {
        const admin = await this.getAdmin(adminId);
        if (!admin) {
            return {
                message:    "record not found",
                identifier: adminId,
                error:      "Admin does not exist",
            };
        }

        await admin.restore();

        return admin;
    }
}
