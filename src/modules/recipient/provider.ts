import { Injectable } from "@graphql-modules/di";
import Transaction, { getTransactionByRecipientIds } from "@shared/transaction";
import { ErrorResponse } from "@shared/types";
import { Op } from "sequelize";
import underscore from "underscore";
import BankInfo from "../../models/bankInfo";
import Recipient from "../../models/recipient";
import RecipientArgs, { RecipientUpdateArgs } from "./input";

@Injectable()
export default class RecipientProvider {
    async getRecipientByUser(userId: string, limit: number, offset: number):
        Promise<{ total: number, recipients: Array<Recipient> }> {
        const recipientCount = await Recipient.count({ where: { userId } });
        const recipients = await Recipient.findAll({
            where:   { userId },
            include: [
                {
                    model: BankInfo,
                    as:    "bankInfo",
                },
            ],
            limit,
            offset,
            subQuery: false,
            order:    [["name", "ASC"]],
        });
        const data = await this.getRecipientTransaction(recipients);

        return {
            total:      recipientCount,
            recipients: data,
        };
    }

    async getAllRecipient(limit: number, offset: number): Promise<{ total: number, recipients: Array<Recipient> }> {
        const recipientCount = await Recipient.count();
        const recipients = await Recipient.findAll({
            include: [
                {
                    model: BankInfo,
                    as:    "bankInfo",
                },
            ],
            limit,
            offset,
            subQuery: false,
            order:    [["name", "ASC"]],
        });
        const data = await this.getRecipientTransaction(recipients);

        return {
            total:      recipientCount,
            recipients: data,
        };
    }

    async getRecipientTransaction(recipients: Array<Recipient>): Promise<Array<Recipient>> {
        const recipientIds = underscore.pluck(recipients, "id");
        const transactions = await getTransactionByRecipientIds(recipientIds);

        return recipients.map(recipient => ({
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            ...recipient.dataValues,
            bankInfo:    recipient.bankInfo,
            transaction: transactions.find((transaction: Transaction) => recipient.id === transaction.recipientId),
        })) as unknown as Array<Recipient>;
    }

    async getRecipientsByIds(recipientIds: Array<string>): Promise<Array<Recipient>> {
        return Recipient.findAll({
            where:   { id: recipientIds },
            include: [
                {
                    model: BankInfo,
                    as:    "bankInfo",
                },
            ],
            order: [["name", "ASC"]],
        });
    }

    async getRecipient(id: string): Promise<Recipient | null> {
        return Recipient.findByPk(id, {
            include: [
                {
                    model: BankInfo,
                    as:    "bankInfo",
                },
            ],
        });
    }

    async getRecipientByUserAndRecipient(userId: string, recipientId: string): Promise<Recipient | null> {
        return Recipient.findOne({
            where: {
                id: recipientId,
                userId,
            },
            include: [
                {
                    model: BankInfo,
                    as:    "bankInfo",
                },
            ],
        });
    }

    async fetchRecipient(identifier: string): Promise<Recipient | null> {
        return Recipient.findOne({
            where: {
                [Op.or]: [
                    { phoneNumber: identifier },
                    { email: identifier },
                ],
            },
        });
    }

    async createRecipient(recipientArgs: RecipientArgs, userId: string): Promise<Recipient | ErrorResponse> {
        return Recipient.create({
            name:        recipientArgs.name,
            email:       recipientArgs.email,
            phoneNumber: recipientArgs.phoneNumber,
            location:    recipientArgs.location,
            userId,
        }, {
            include: [
                {
                    model: BankInfo,
                    as:    "bankInfo",
                },
            ],
        });
    }

    async fetchRecipientExcludingRecipient(identifier: string, recipientId: string): Promise<Recipient | null> {
        return Recipient.findOne({
            where: {
                [Op.or]: [
                    { phoneNumber: identifier },
                    { email: identifier },
                ],
                [Op.not]: [
                    { id: recipientId },
                ],
            },
        });
    }

    async updateRecipient(userId: string, recipientId: string, recipientArgs: RecipientUpdateArgs):
        Promise<Recipient | ErrorResponse> {
        const recipient = await this.getRecipientByUserAndRecipient(userId, recipientId);
        if (!recipient) {
            return {
                message:    "record not found",
                identifier: recipientId,
                error:      "Recipient does not exist",
            };
        }

        recipient.name = recipientArgs.name;
        recipient.phoneNumber = recipientArgs.phoneNumber;
        recipient.email = recipientArgs.email;
        recipient.location = recipientArgs.location;
        await recipient.save();

        return recipient;
    }

    async deactivateRecipient(userId: string, recipientId: string): Promise<Recipient | ErrorResponse> {
        const recipient = await this.getRecipientByUserAndRecipient(userId, recipientId);
        if (!recipient) {
            return {
                message:    "record not found",
                identifier: recipientId,
                error:      "Recipient does not exist",
            };
        }

        await recipient.destroy();

        return recipient;
    }
}
