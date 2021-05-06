import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import UserProvider from "../user/provider";
import UserVerificationProvider from "./provider";
import UserVerificationResolver from "./resolver";

const userVerificationModule: GraphQLModule = new GraphQLModule({
    providers:    [UserVerificationProvider, UserVerificationResolver, UserProvider],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [UserVerificationResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            // eslint-disable-next-line max-len
            container:   ({ context }): Injector<Session> => userVerificationModule.injector.getSessionInjector(context),
        }),
    ],
});

export default userVerificationModule;
