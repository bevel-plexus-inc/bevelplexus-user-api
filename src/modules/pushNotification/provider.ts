import { Injectable } from "@graphql-modules/di";
import PushNotification from "@models/pushNotification";
import { ErrorResponse } from "@shared/types";
import { Op } from "sequelize";
import sentryHttpLogger from "../../lib/sentryHttpLogger";
import PushNotificationArgs from "./input";

@Injectable()
export default class PushNotificationProvider {
    async getPushNotification(pushNotificationId: string): Promise<PushNotification | null> {
        return PushNotification.findByPk(pushNotificationId);
    }

    async getPushNotifications(): Promise<Array<PushNotification>> {
        const now = new Date();
        const aWeekAgo = new Date().setDate(now.getDate() - 7);

        return PushNotification.findAll({
            where: { createdAt: { [Op.gte]: aWeekAgo } },
            order: [["createdAt", "DESC"]],
        });
    }

    async getPushNotificationsByAdmin(): Promise<Array<PushNotification>> {
        return PushNotification.findAll({ order: [["createdAt", "DESC"]] });
    }

    async createPushNotification(pushNotificationArgs: PushNotificationArgs):
        Promise<PushNotification | ErrorResponse> {
        try {
            return PushNotification.create(pushNotificationArgs);
        } catch (e) {
            sentryHttpLogger(e, {
                method:      "Database create request",
                body:        pushNotificationArgs,
                originalUrl: "createPushNotification",
            });

            return {
                message:    "Error saving push notification",
                error:      "Problem saving push notification",
                identifier: pushNotificationArgs.userType,
            };
        }
    }

    async deletePushNotification(pushNotificationId: string): Promise<PushNotification | ErrorResponse> {
        const pushNotification = await this.getPushNotification(pushNotificationId);
        if (!pushNotification) {
            return {
                message:    "Record not found",
                error:      "Notification not found",
                identifier: pushNotificationId,
            };
        }

        await pushNotification.destroy();

        return pushNotification;
    }
}
