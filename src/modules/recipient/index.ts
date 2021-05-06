import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
import UserProvider from "@modules/user/provider";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import RecipientProvider from "./provider";
import RecipientResolver from "./resolver";

const recipientModule: GraphQLModule = new GraphQLModule({
    providers:    [RecipientProvider, RecipientResolver, UserProvider],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [RecipientResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => recipientModule.injector.getSessionInjector(context),
        }),
    ],
});

export default recipientModule;
