import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import RoleProvider from "./provider";
import RoleResolver from "./resolver";

const roleModule: GraphQLModule = new GraphQLModule({
    providers:    [RoleProvider, RoleResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [RoleResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => roleModule.injector.getSessionInjector(context),
        }),
    ],
});

export default roleModule;
