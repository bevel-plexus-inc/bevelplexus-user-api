import { GraphQLModule } from "@graphql-modules/core";
import { authResolver } from "@lib/authentication";
import adminModule from "./admin";
import authenticationModule from "./authentication";
import bankInfoVerificationModule from "./bankInfo";
import pushNotificationModule from "./pushNotification";
import recipientVerificationModule from "./recipient";
import regularAccountDetailModule from "./regularAccountDetail";
import roleModule from "./role";
import studentAccountDetailModule from "./studentAccountDetail";
import userModule from "./user";
import userKycModule from "./userKyc";
import userVerificationModule from "./userVerification";

const rootModule = new GraphQLModule({
    imports: [
        adminModule,
        userModule,
        roleModule,
        userKycModule,
        authenticationModule,
        regularAccountDetailModule,
        studentAccountDetailModule,
        bankInfoVerificationModule,
        recipientVerificationModule,
        userVerificationModule,
        pushNotificationModule,
    ],
    context: authResolver,
});

export default rootModule;
