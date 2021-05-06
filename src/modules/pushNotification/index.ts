import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import PushNotificationProvider from "./provider";
import PushNotificationResolver from "./resolver";

const pushNotificationModule: GraphQLModule = new GraphQLModule({
    providers:    [PushNotificationProvider, PushNotificationResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [PushNotificationResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            // eslint-disable-next-line max-len
            container:   ({ context }): Injector<Session> => pushNotificationModule.injector.getSessionInjector(context),
        }),
    ],
});

export default pushNotificationModule;
