import Institution from "@shared/institution";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class StudentAccountDetail {
    @Field()
    id: string;

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

    @Field(returns => Institution, { nullable: true })
    institution?: Institution;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;
}
