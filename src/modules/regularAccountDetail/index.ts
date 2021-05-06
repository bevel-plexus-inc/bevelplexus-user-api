import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import RegularAccountDetailProvider from "./provider";
import RegularAccountDetailResolver from "./resolver";

const regularAccountDetailModule: GraphQLModule = new GraphQLModule({
    providers:    [RegularAccountDetailProvider, RegularAccountDetailResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [RegularAccountDetailResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            // eslint-disable-next-line max-len
            container:   ({ context }): Injector<Session> => regularAccountDetailModule.injector.getSessionInjector(context),
        }),
    ],
});

export default regularAccountDetailModule;
