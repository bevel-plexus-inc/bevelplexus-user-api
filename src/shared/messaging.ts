import { gql, GraphQLClient } from "graphql-request";
import { EmailArgs } from "../modules/userVerification/input";

// FIXME: make all function using ntofication service use the right email type
export async function notificationEmailRequest(emailArgs: EmailArgs): Promise<void> {
    const mutation = gql`
            mutation email($email: EmailArgs!) {
                email(emailArgs: $email) {
                    fromEmail
                    parameters {
                        verificationUrl
                        receivers {
                            name
                            email
                        }
                    }
                    sibMessageId
                    status
                    templateId
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_MESSAGING_SERVICE!, { headers: { apikey: process.env.BEVEL_MESSAGING_API_KEY! } });
    await graphQLClient.request(mutation, { email: emailArgs });
}

export async function notificationSMSRequest(smsArgs: { phoneNumber: string, body: string }): Promise<void> {
    const mutation = gql`
            mutation sms($smsArgs: SmsArgs!) {
                sms(smsArgs: $smsArgs) {
                    phoneNumber
                    body
                    createdAt
                    updatedAt
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_MESSAGING_SERVICE!, { headers: { apikey: process.env.BEVEL_MESSAGING_API_KEY! } });
    await graphQLClient.request(mutation, { smsArgs });
}

export async function notificationAdminHelpRequest(helpArgs: { name: string, email: string, message: string }): Promise<void> {
    const mutation = gql`
            mutation adminHelpRequest($helpArgs: HelpArgs!) {
                adminHelpRequest(helpArgs: $helpArgs)
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_MESSAGING_SERVICE!, { headers: { apiKey: process.env.BEVEL_MESSAGING_API_KEY! } });
    await graphQLClient.request(mutation, { helpArgs });
}
