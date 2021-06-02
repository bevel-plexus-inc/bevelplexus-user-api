import moduleAlias from "module-alias";
// tslint:disable-next-line:no-import-side-effect
import "module-alias/register";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";

moduleAlias.addAliases({
    "@shared":      `${__dirname}/shared`,
    "@modules":     `${__dirname}/modules`,
    "@models":      `${__dirname}/models`,
    "@lib":         `${__dirname}/lib`,
    "@routes":      `${__dirname}/routes`,
    "@controllers": `${__dirname}/controllers`,
});
// tslint:disable-next-line:comment-type
/* eslint-disable import/first */

import sentryPlugin from "@lib/sentryGraphQLPlugin";
import appModule from "@modules/index";
import healthRoutes from "@routes/healthRoute";
import kycRoutes from "@routes/userKycRoute";
import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { ApolloServer } from "apollo-server-express";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import { OK } from "http-status-codes";

const app = express();
Sentry.init({
    environment:      process.env.NODE_ENV,
    release:          `${process.env.APP_NAME}-${process.env.VERSION}` || "0.dev",
    dsn:              process.env.SENTRY_DSN,
    tracesSampleRate: 1,
    integrations:     [
        new RewriteFrames({ root: process.cwd() }),
    ],
});

app.use(helmet());
app.use(cors());
app.use("/graphql", cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options("*", cors());

const server = new ApolloServer({
    schema:        appModule.schema,
    subscriptions: appModule.subscriptions,
    context:       appModule.context,
    plugins:       [sentryPlugin],
});

server.applyMiddleware({ app });

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use("/verify", kycRoutes);
app.use("/health", healthRoutes);
app.get("/", (req, res) => res.status(OK).json({ message: "Welcome to Bevel User API" }));
app.post("/", (req, res) => res.status(OK).json({ message: "Welcome to Bevel User API" }));
app.use(Sentry.Handlers.errorHandler());

const defaultPort = 5000;
const port = process.env.PORT || defaultPort;

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
    console.log(`working on port ${port}`);
});
