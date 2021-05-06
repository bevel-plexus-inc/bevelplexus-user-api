import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import UserKycProvider from "./provider";
import UserKycResolver from "./resolver";

const userKycModule: GraphQLModule = new GraphQLModule({
    providers:    [UserKycProvider, UserKycResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [UserKycResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            // eslint-disable-next-line max-len
            container:   ({ context }): Injector<Session> => userKycModule.injector.getSessionInjector(context),
        }),
    ],
});

export default userKycModule;
