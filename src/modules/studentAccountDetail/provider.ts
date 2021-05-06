import { Injectable } from "@graphql-modules/di";
import { ErrorResponse } from "@shared/types";
import StudentAccountDetail from "../../models/studentAccountDetail";
import StudentAccountDetailArgs from "./input";

@Injectable()
export default class StudentAccountDetailProvider {
    async getAccountDetails(id: string): Promise<StudentAccountDetail | null> {
        return StudentAccountDetail.findByPk(id);
    }

    async getAccountDetailsByUser(userId: string): Promise<StudentAccountDetail | null> {
        return StudentAccountDetail.findOne({ where: { userId } });
    }

    async getAccountDetailsByUserAndAccount(userId: string, accountId: string): Promise<StudentAccountDetail | null> {
        return StudentAccountDetail.findOne({ where: { userId, id: accountId } });
    }

    async addAccountDetails(accountDetails: StudentAccountDetailArgs): Promise<StudentAccountDetail | ErrorResponse> {
        const existingDetails = await this.getAccountDetailsByUser(accountDetails.userId);
        if (existingDetails) {
            return {
                message:    "record already exist",
                identifier: accountDetails.userId,
                error:      `Account Details with user Id: ${accountDetails.userId}, already exists`,
            };
        }

        return StudentAccountDetail.create({
            userId:           accountDetails.userId,
            studentNumber:    accountDetails.studentNumber,
            studentEmail:     accountDetails.studentEmail,
            yearOfGraduation: accountDetails.yearOfGraduation,
            course:           accountDetails.course,
            institutionId:    accountDetails.institutionId,
            countryId:        accountDetails.countryId,
            dateOfBirth:      accountDetails.dateOfBirth,
        });
    }

    async deactivateAccountDetails(userId: string, accountId: string): Promise<StudentAccountDetail | ErrorResponse> {
        const accountDetails = await this.getAccountDetailsByUserAndAccount(userId, accountId);

        if (!accountDetails) {
            return {
                message:    "record not found",
                identifier: accountId,
                error:      `Account Details with id: ${accountId}, not found`,
            };
        }

        await accountDetails.destroy();

        return accountDetails;
    }
}
