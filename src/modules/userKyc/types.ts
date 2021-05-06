import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class UserKyc {
    @Field()
    id: string;

    @Field()
    userId: string;

    @Field({ nullable: true })
    status?: string;

    @Field({ nullable: true })
    jobId?: string;

    @Field({ nullable: true })
    result?: string;

    @Field()
    isVerified: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
