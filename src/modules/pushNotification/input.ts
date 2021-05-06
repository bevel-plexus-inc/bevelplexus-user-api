import { Field, InputType } from "type-graphql";
import { UserType } from "../../shared/types";

@InputType()
export default class PushNotificationArg {
    @Field()
    country: string;

    @Field()
    countryIso3Code: string;

    @Field(returns => UserType)
    userType: UserType;

    @Field()
    message: string;
}
