import { Field, InputType } from "type-graphql";

@InputType()
export default class StudentAccountDetailArgs {
    @Field()
    userId: string;

    @Field()
    studentNumber: string;

    @Field()
    studentEmail: string;

    @Field()
    institutionId: string;

    @Field()
    countryId: string;

    @Field()
    yearOfGraduation: Date;

    @Field()
    course: string;

    @Field()
    dateOfBirth: Date;
}
