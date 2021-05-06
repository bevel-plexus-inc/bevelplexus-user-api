import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class UserVerification {
    @Field()
    id: string;

    @Field()
    userId: string;

    @Field()
    isIdentityVerified: boolean;

    @Field({ nullable: true })
    identityDocumentUrl?: string;

    @Field()
    isSchoolEnrollmentVerified: boolean;

    @Field({ nullable: true })
    enrollmentDocumentUrl?: string;

    @Field()
    isPhoneNumberVerified: boolean;

    @Field({ nullable: true })
    utilityBillUrl?: string;

    @Field()
    isUtilityBillVerified: boolean;

    @Field()
    level: number;

    @Field()
    isEmailVerified: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;
}
