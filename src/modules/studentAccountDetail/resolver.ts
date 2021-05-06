import { isInstanceOfError } from "@lib/instanceChecker";
import User from "@modules/user/types";
import { ErrorResponse } from "@shared/types";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Ctx, Mutation, Query, Resolver,
} from "type-graphql";
import StudentAccountDetailArgs from "./input";
import StudentAccountDetailProvider from "./provider";
import StudentAccountDetail from "./types";

@Resolver(of => StudentAccountDetail)
export default class StudentAccountDetailResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly studentAccountDetailProvider: StudentAccountDetailProvider) {}

    @Authorized()
    @Query(returns => StudentAccountDetail, { nullable: true })
    async studentAccountDetails(@Arg("id") id: string): Promise<StudentAccountDetail | null> {
        return this.studentAccountDetailProvider.getAccountDetails(id);
    }

    @Authorized()
    @Query(returns => StudentAccountDetail, { nullable: true })
    async studentAccountDetailsByUser(@Arg("userId") userId: string):
        Promise<StudentAccountDetail | null> {
        return this.studentAccountDetailProvider.getAccountDetailsByUser(userId);
    }

    @Authorized()
    @Mutation(returns => StudentAccountDetail)
    async addStudentAccountDetails(@Arg("accountDetails", returns => StudentAccountDetailArgs)
        accountDetails: StudentAccountDetailArgs): Promise<StudentAccountDetail> {
        const response = await this.studentAccountDetailProvider.addAccountDetails(accountDetails);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as StudentAccountDetail;
    }

    @Authorized()
    @Mutation(returns => StudentAccountDetail)
    async deactivateStudentAccountDetails(
        @Arg("id") id: string,
        @Ctx() ctx: { user: User },
    ): Promise<StudentAccountDetail> {
        const response = await this.studentAccountDetailProvider.deactivateAccountDetails(ctx.user.id, id);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as StudentAccountDetail;
    }
}
