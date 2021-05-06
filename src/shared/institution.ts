// eslint-disable-next-line max-classes-per-file
import { gql, GraphQLClient } from "graphql-request";
import { Field, ObjectType } from "type-graphql";
import Country from "./country";

export async function getInstitution(institutionId: string): Promise<Institution> {
    const query = gql`
            query getInstitution($institutionId: String!) {
                getInstitution(institutionId: $institutionId) {
                    id
                    name
                    city
                    countryId
                    createdAt
                    updatedAt
                    country {
                        id
                        name
                        countryCode
                        currencyCode
                        createdAt
                        updatedAt
                    }
                    institutionBankInfo {
                        id
                        institutionId
                        bank
                        bankCode
                        accountNumber
                        transitOrSortCode
                    }
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_TRANSACTION_SERVICE!, { headers: { apikey: process.env.BEVEL_TRANSACTION_API_KEY! } });
    const response = await graphQLClient.request(query, { institutionId });

    if (!response || response.errors) {
        throw new Error("Error getting user institution");
    }

    return response.getInstitution;
}

@ObjectType()
export class InstitutionBankInfo {
    @Field()
    id: string;

    @Field()
    institutionId: string;

    @Field()
    bank: string;

    @Field()
    bankCode: string;

    @Field()
    accountNumber: string;

    @Field({ nullable: true })
    transitOrSortCode?: string;
}

@ObjectType()
export default class Institution {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    city: string;

    @Field()
    countryId: string;

    @Field(returns => Country)
    country: Country;

    @Field(returns => InstitutionBankInfo, { nullable: true })
    institutionBankInfo?: InstitutionBankInfo;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
