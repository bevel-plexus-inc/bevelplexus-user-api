import { Injectable } from "@graphql-modules/di";
import { getEncryptedPassword, isPasswordEqual } from "@lib/authentication";
import BankInfo from "@models/bankInfo";
import Recipient from "@models/recipient";
import RegularAccountDetail from "@models/regularAccountDetail";
import StudentAccountDetail from "@models/studentAccountDetail";
import User from "@models/user";
import UserKyc from "@models/userKyc";
import UserVerification from "@models/userVerification";
import { getCountry } from "@shared/country";
import { getInstitution } from "@shared/institution";
import { notificationEmailRequest } from "@shared/messaging";
import { EmailType, ErrorResponse, UserType } from "@shared/types";
import moment from "moment";
import { col, fn, Op } from "sequelize";
import UserArgs, { UserUpdateArgs } from "./input";
import { UserList } from "./types";

@Injectable()
export default class UserProvider {
    async getUser(userId: string): Promise<User | null> {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: StudentAccountDetail,
                    as:    "studentAccountDetail",
                },
                {
                    model: RegularAccountDetail,
                    as:    "regularAccountDetail",
                },
                {
                    model: UserVerification,
                    as:    "userVerification",
                },
                {
                    model:   Recipient,
                    as:      "recipient",
                    include: [
                        {
                            model: BankInfo,
                            as:    "bankInfo",
                        },
                    ],
                },
                {
                    model: UserKyc,
                    as:    "userKyc",
                },
            ],
            paranoid: false,
        });

        if (!user) {
            return null;
        }

        return this.attachInstitutionAndCountry(user);
    }

    async getUsers(limit?: number, offset?: number): Promise<UserList> {
        const users = await User.findAll({
            include: [
                {
                    model: StudentAccountDetail,
                    as:    "studentAccountDetail",
                },
                {
                    model: RegularAccountDetail,
                    as:    "regularAccountDetail",
                },
                {
                    model: UserVerification,
                    as:    "userVerification",
                },
                {
                    model:   Recipient,
                    as:      "recipient",
                    include: [
                        {
                            model: BankInfo,
                            as:    "bankInfo",
                        },
                    ],
                },
                {
                    model: UserKyc,
                    as:    "userKyc",
                },
            ],
            limit,
            offset,
            paranoid:   false,
            order:      [["createdAt", "DESC"]],
            attributes: { exclude: ["password"] },
        });

        const total = await User.count({ paranoid: false });

        return {
            users,
            total,
        };
    }

    async fetchUser(identifier: string): Promise<User | null> {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { phoneNumber: identifier },
                    { email: identifier },
                ],
            },
            include: [
                {
                    model: StudentAccountDetail,
                    as:    "studentAccountDetail",
                },
                {
                    model: RegularAccountDetail,
                    as:    "regularAccountDetail",
                },
                {
                    model: UserVerification,
                    as:    "userVerification",
                },
                {
                    model:   Recipient,
                    as:      "recipient",
                    include: [
                        {
                            model: BankInfo,
                            as:    "bankInfo",
                        },
                    ],
                },
                {
                    model: UserKyc,
                    as:    "userKyc",
                },
            ],
        });

        if (!user) {
            return null;
        }

        return this.attachInstitutionAndCountry(user);
    }

    async attachInstitutionAndCountry(incomingUser: User): Promise<User> {
        const user = incomingUser;

        if (user.getDataValue("userType") === UserType.Regular && user.regularAccountDetail) {
            user.regularAccountDetail.country = await getCountry(user.regularAccountDetail.getDataValue("countryId"));
        }

        if (user.getDataValue("userType") === UserType.Student && user.studentAccountDetail) {
            user.studentAccountDetail.institution = await getInstitution(
                user.studentAccountDetail.getDataValue("institutionId"),
            );
        }

        return user;
    }

    async getUserAnalytics(): Promise<{ monthCount: number, weekCount: number, dayCount: number }> {
        const monthCount = await User.count({ where: { createdAt: { [Op.gte]: moment.utc().startOf("month").toDate() } } });
        const weekCount = await User.count({ where: { createdAt: { [Op.gte]: moment.utc().startOf("week").toDate() } } });
        const dayCount = await User.count({ where: { createdAt: { [Op.gte]: moment.utc().startOf("day").toDate() } } });

        return {
            monthCount,
            weekCount,
            dayCount,
        };
    }

    async getUserRegistrationAnalytics(): Promise<Array<{ month: string, count: number }>> {
        // tslint:disable-next-line:ban-ts-ignore
        // @ts-ignore
        return User.findAll({
            attributes: [[fn("count", col("id")), "count"], [fn("DATE_FORMAT", col("created_at"), "%Y-%m"), "month"]],
            group:      [fn("DATE_FORMAT", col("created_at"), "%Y-%m")],
            raw:        true,
            limit:      6,
        });
    }

    async getUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
        const user = await User.findOne({
            where:      { phoneNumber },
            paranoid:   false,
            attributes: { exclude: ["password"] },
            include:    [
                {
                    model: StudentAccountDetail,
                    as:    "studentAccountDetail",
                },
                {
                    model: RegularAccountDetail,
                    as:    "regularAccountDetail",
                },
                {
                    model: UserVerification,
                    as:    "userVerification",
                },
                {
                    model:   Recipient,
                    as:      "recipient",
                    include: [
                        {
                            model: BankInfo,
                            as:    "bankInfo",
                        },
                    ],
                },
                {
                    model: UserKyc,
                    as:    "userKyc",
                },
            ],
        });

        if (!user) {
            return null;
        }

        return this.attachInstitutionAndCountry(user);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await User.findOne({
            where:      { email },
            paranoid:   false,
            attributes: { exclude: ["password"] },
            include:    [
                {
                    model: StudentAccountDetail,
                    as:    "studentAccountDetail",
                },
                {
                    model: RegularAccountDetail,
                    as:    "regularAccountDetail",
                },
                {
                    model: UserVerification,
                    as:    "userVerification",
                },
                {
                    model:   Recipient,
                    as:      "recipient",
                    include: [
                        {
                            model: BankInfo,
                            as:    "bankInfo",
                        },
                    ],
                },
                {
                    model: UserKyc,
                    as:    "userKyc",
                },
            ],
        });

        if (!user) {
            return null;
        }

        return this.attachInstitutionAndCountry(user);
    }

    async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<User | ErrorResponse> {
        const user = await this.getUser(userId);
        if (!user) {
            return {
                message:    "record not found",
                identifier: userId,
                error:      "User not found",
            };
        }

        if (!isPasswordEqual(oldPassword, user.getDataValue("password"))) {
            return {
                message:    "incorrect password",
                identifier: userId,
                error:      "Old password is not correct",
            };
        }

        user.password = getEncryptedPassword(newPassword);
        await user.save();

        return user;
    }

    async createUser(userArgs: UserArgs): Promise<User | ErrorResponse> {
        const existingUserEmail = await this.fetchUser(userArgs.email);
        if (existingUserEmail) {
            return {
                message:    "record already exist",
                identifier: userArgs.email,
                error:      `User with email: ${userArgs.email}, already exists`,
            };
        }

        if (userArgs.phoneNumber) {
            const existingUserPhoneNumber = await this.fetchUser(userArgs.phoneNumber);
            if (existingUserPhoneNumber) {
                return {
                    message:    "record already exist",
                    identifier: userArgs.phoneNumber,
                    error:      `User with phone number: ${userArgs.phoneNumber}, already exists`,
                };
            }
        }

        const user = await User.create({
            firstName:    userArgs.firstName,
            lastName:     userArgs.lastName,
            email:        userArgs.email,
            phoneNumber:  userArgs.phoneNumber,
            userType:     userArgs.userType,
            password:     userArgs.password,
            referralCode: userArgs.referralCode,
        }, {
            include: [
                {
                    model: StudentAccountDetail,
                    as:    "studentAccountDetail",
                },
                {
                    model: RegularAccountDetail,
                    as:    "regularAccountDetail",
                },
                {
                    model: UserVerification,
                    as:    "userVerification",
                },
                {
                    model: Recipient,
                    as:    "recipient",
                },
                {
                    model: UserKyc,
                    as:    "userKyc",
                },
            ],
        });

        await UserKyc.create({ userId: user.getDataValue("id") });

        return user;
    }

    async fetchUserExcludingUser(identifier: string, userId: string): Promise<User | null> {
        return User.findOne({
            where: {
                [Op.or]: [
                    { phoneNumber: identifier },
                    { email: identifier },
                ],
                [Op.not]: [
                    { id: userId },
                ],
            },
            attributes: { exclude: ["password"] },
            include:    [
                {
                    model: StudentAccountDetail,
                    as:    "studentAccountDetail",
                },
                {
                    model: RegularAccountDetail,
                    as:    "regularAccountDetail",
                },
                {
                    model: UserVerification,
                    as:    "userVerification",
                },
                {
                    model:   Recipient,
                    as:      "recipient",
                    include: [
                        {
                            model: BankInfo,
                            as:    "bankInfo",
                        },
                    ],
                },
                {
                    model: UserKyc,
                    as:    "userKyc",
                },
            ],
            paranoid: false,
        });
    }

    async updateUser(userId: string, userArgs: UserUpdateArgs): Promise<User | ErrorResponse> {
        const user = await this.getUser(userId);
        if (!user) {
            return {
                message:    "record not found",
                identifier: userId,
                error:      "User does not exist",
            };
        }

        if (userArgs.email) {
            const existingUserEmail = await this.fetchUserExcludingUser(userArgs.email, userId);
            if (existingUserEmail) {
                return {
                    message:    "record already exist",
                    identifier: userArgs.email,
                    error:      `Another user with email: ${userArgs.email}, already exists`,
                };
            }

            user.email = userArgs.email;
        }

        if (userArgs.phoneNumber) {
            const existingUserPhoneNumber = await this.fetchUserExcludingUser(userArgs.phoneNumber, userId);
            if (existingUserPhoneNumber) {
                return {
                    message:    "record already exist",
                    identifier: userArgs.phoneNumber,
                    error:      `Another user with phone number: ${userArgs.phoneNumber}, already exists`,
                };
            }

            user.phoneNumber = userArgs.phoneNumber;
        }

        if (userArgs.firstName) {
            user.firstName = userArgs.firstName;
        }
        if (userArgs.lastName) {
            user.lastName = userArgs.lastName;
        }

        await user.save();

        return user;
    }

    async deactivateUser(userId: string): Promise<User | ErrorResponse> {
        const user = await this.getUser(userId);
        if (!user) {
            return {
                message:    "record not found",
                identifier: userId,
                error:      "User does not exist",
            };
        }

        await user.destroy();

        return user;
    }

    async requestHelp(name: string, email: string, message: string): Promise<boolean> {
        await notificationEmailRequest({
            emailType:  EmailType.RequestHelp,
            parameters: {
                receivers: [
                    {
                        name,
                        email,
                        firstName: name,
                        lastName:  name,
                    },
                ],
            },
        });
        // FIXME: uncomment when admin email is ready
        // await notificationAdminHelpRequest({ name, email, message });

        return true;
    }
// tslint:disable-next-line:max-file-line-count
}
