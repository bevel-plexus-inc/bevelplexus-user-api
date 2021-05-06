import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole } from "@shared/types";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription,
} from "type-graphql";
import PushNotificationArgs from "./input";
import PushNotificationProvider from "./provider";
import PushNotificationData from "./subscription";
import PushNotification from "./types";

const subscriptionTopic = "PUSH_NOTIFICATION";

@Resolver(of => PushNotification)
export default class PushNotificationResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly pushNotificationProvider: PushNotificationProvider) {}

    @Authorized(GenericRole.Admin)
    @Query(returns => PushNotification, { nullable: true })
    async getPushNotification(@Arg("pushNotificationId") pushNotificationId: string): Promise<PushNotification | null> {
        return this.pushNotificationProvider.getPushNotification(pushNotificationId);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => [PushNotification])
    async getPushNotificationsByAdmin(): Promise<Array<PushNotification>> {
        return this.pushNotificationProvider.getPushNotificationsByAdmin();
    }

    @Authorized()
    @Query(returns => [PushNotification])
    async getPushNotifications(): Promise<Array<PushNotification>> {
        return this.pushNotificationProvider.getPushNotifications();
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => PushNotification)
    async createPushNotification(
        @Arg("pushNotificationArgs", returns => PushNotificationArgs) pushNotificationArgs: PushNotificationArgs,
        @PubSub() pubSub: PubSubEngine,
    ): Promise<PushNotification> {
        const response = await this.pushNotificationProvider.createPushNotification(pushNotificationArgs);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        await pubSub.publish(subscriptionTopic, {
            country:         pushNotificationArgs.country,
            countryIso3Code: pushNotificationArgs.countryIso3Code,
            message:         pushNotificationArgs.message,
            userType:        pushNotificationArgs.userType,
        });

        return response as PushNotification;
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => PushNotification)
    async deletePushNotification(@Arg("pushNotificationId") pushNotificationId: string): Promise<PushNotification> {
        const response = await this.pushNotificationProvider.deletePushNotification(pushNotificationId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as PushNotification;
    }

    @Subscription(returns => PushNotificationData, { topics: subscriptionTopic })
    incomingCall(@Root() callPayload: PushNotificationData): PushNotificationData {
        return callPayload;
    }
}
