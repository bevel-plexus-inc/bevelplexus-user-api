import { gql, GraphQLClient } from "graphql-request";
import { Field, ObjectType } from "type-graphql";

export async function getCountry(countryId: string): Promise<Country> {
    const query = gql`
            query getCountry($countryId: String!) {
                getCountry(countryId: $countryId) {
                    id
                    name
                    countryCode
                    currencyCode
                    createdAt
                    updatedAt
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_TRANSACTION_SERVICE!, { headers: { apikey: process.env.BEVEL_TRANSACTION_API_KEY! } });
    const response = await graphQLClient.request(query, { countryId });

    if (!response || response.errors) {
        throw new Error(JSON.stringify("Error getting user country"));
    }

    return response.getCountry;
}

@ObjectType()
export default class Country {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    countryCode: string;

    @Field()
    currencyCode: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
