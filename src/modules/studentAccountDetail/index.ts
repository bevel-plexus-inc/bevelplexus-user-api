import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import StudentAccountDetailProvider from "./provider";
import StudentAccountDetailResolver from "./resolver";

const studentAccountDetailModule: GraphQLModule = new GraphQLModule({
    providers:    [StudentAccountDetailProvider, StudentAccountDetailResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [StudentAccountDetailResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            // eslint-disable-next-line max-len
            container:   ({ context }): Injector<Session> => studentAccountDetailModule.injector.getSessionInjector(context),
        }),
    ],
});

export default studentAccountDetailModule;
