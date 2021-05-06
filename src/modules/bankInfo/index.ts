import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import BankInfoProvider from "./provider";
import BankInfoResolver from "./resolver";

const bankInfoModule: GraphQLModule = new GraphQLModule({
    providers:    [BankInfoProvider, BankInfoResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [BankInfoResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => bankInfoModule.injector.getSessionInjector(context),
        }),
    ],
});

export default bankInfoModule;
