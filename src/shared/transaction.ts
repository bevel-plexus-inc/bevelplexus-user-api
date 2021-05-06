import { gql, GraphQLClient } from "graphql-request";
import { Field, ObjectType, registerEnumType } from "type-graphql";

interface AccountProps {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
}

export async function transactionCreateAccount(accountArgs: AccountProps): Promise<void> {
    const mutation = gql`
            mutation createAccount($accountArgs: AccountArgs!) {
                createAccount(accountArgs: $accountArgs) {
                    userId
                    email
                    firstName
                    lastName
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_TRANSACTION_SERVICE!, { headers: { apikey: process.env.BEVEL_TRANSACTION_API_KEY! } });
    await graphQLClient.request(mutation, { accountArgs });
}

export async function getTransactionByRecipientIds(recipientIds: Array<string>): Promise<Array<Transaction>> {
    const query = gql`
            query getTransactionByRecipientIds($recipientIds: [String!]!) {
                getTransactionByRecipientIds(recipientIds: $recipientIds) {
                    id
                    userId
                    recipientId
                    bankInfoId
                    rate
                    fee
                    baseAmount
                    actualAmount
                    sendCurrency
                    destinationCurrency
                    convertedAmount
                    status
                    transactionType
                    receiveType
                    reference
                    createdAt
                    updatedAt
                    deletedAt
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_TRANSACTION_SERVICE!, { headers: { apikey: process.env.BEVEL_TRANSACTION_API_KEY! } });
    const response = await graphQLClient.request(query, { recipientIds });

    return response.getTransactionByRecipientIds;
}

export enum TransactionType {
    Individual = "Individual",
    Tuition = "Tuition",
}

registerEnumType(TransactionType, {
    name:        "TransactionType",
    description: "types of transaction, either individual or tuition",
});

export enum ReceiveType {
    SameDay = "SameDay",
    Delayed = "Delayed",
}

registerEnumType(ReceiveType, {
    name:        "ReceiveType",
    description: "types of receiving method, either same day or delayed",
});

@ObjectType()
export default class Transaction {
    @Field()
    id: string;

    @Field()
    recipientId: string;

    @Field()
    userId: string;

    @Field()
    bankInfoId: string;

    @Field({ nullable: true })
    reference?: string;

    @Field()
    rate: number;

    @Field()
    fee: number;

    @Field()
    baseAmount: number;

    @Field()
    actualAmount: number;

    @Field()
    sendCurrency: string;

    @Field()
    destinationCurrency: string;

    @Field()
    convertedAmount: number;

    @Field()
    status: string;

    @Field(returns => TransactionType)
    transactionType: TransactionType;

    @Field(returns => ReceiveType)
    receiveType: ReceiveType;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;

    @Field({ nullable: true })
    deletedAt?: string;
}
