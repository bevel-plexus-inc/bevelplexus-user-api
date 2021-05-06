import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import AdminProvider from "./provider";
import AdminResolver from "./resolver";

const adminModule: GraphQLModule = new GraphQLModule({
    providers:    [AdminProvider, AdminResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [AdminResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => adminModule.injector.getSessionInjector(context),
        }),
    ],
});

export default adminModule;
