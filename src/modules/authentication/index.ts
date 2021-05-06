import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
import UserProvider from "@modules/user/provider";
import UserVerificationProvider from "@modules/userVerification/provider";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import AuthenticationProvider from "./provider";
import AuthenticationResolver from "./resolver";

const authenticationModule: GraphQLModule = new GraphQLModule({
    providers:    [AuthenticationProvider, AuthenticationResolver, UserProvider, UserVerificationProvider],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [AuthenticationResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => authenticationModule.injector.getSessionInjector(context),
        }),
    ],
});

export default authenticationModule;
