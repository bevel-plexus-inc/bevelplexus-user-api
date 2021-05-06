import { Field, ObjectType } from "type-graphql";
import { UserType } from "../../shared/types";

@ObjectType()
export default class PushNotificationData {
    @Field()
    country: string;

    @Field()
    countryIso3Code: string;

    @Field(returns => UserType)
    userType: UserType;

    @Field()
    message: string;
}
