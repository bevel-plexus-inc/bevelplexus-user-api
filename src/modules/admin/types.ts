import { Field, ObjectType } from "type-graphql";
import Role from "../role/types";

@ObjectType()
export default class Admin {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    roleId: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;

    @Field(type => Role)
    role: Role;
}
