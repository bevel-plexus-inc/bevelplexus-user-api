import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class Role {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;
}
