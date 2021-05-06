import sequelize from "@models/index";
import User from "@models/user";
import UserModule from "@modules/user";
import { execute } from "graphql";
import gql from "graphql-tag";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { mockUser } from "./mockData";

describe("Testing UserModule Mutations", () => {
    afterEach(async () => {
        await sequelize.sync({ force: true });
    });

    it("Should create user", async () => {
        const { schema } = UserModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation addUser($userArgs: UserArgs!) {
                    addUser(userArgs: $userArgs) {
                        firstName
                        lastName
                        email
                    }
                }
            `,
            variableValues: { userArgs: mockUser },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.addUser).toBeTruthy();
        expect(result.data!.addUser.firstName).toBe(mockUser.firstName);
        expect(result.data!.addUser.lastName).toBe(mockUser.lastName);
        expect(result.data!.addUser.email).toBe(mockUser.email);
    });

    it("Should create user and return required data", async () => {
        const user = await User.create(mockUser, { raw: true });
        const { schema } = UserModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation updateUser($userId: String!, $userArgs: UserUpdateArgs!) {
                    updateUser(userId: $userId, userArgs: $userArgs) {
                        firstName
                        lastName
                        email
                    }
                }
            `,
            variableValues: {
                userId:   user.id,
                userArgs: {
                    firstName: user.firstName,
                    lastName:  user.lastName,
                },
            },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.updateUser).toBeTruthy();
        expect(result.data!.updateUser.firstName).toBe(mockUser.firstName);
        expect(result.data!.updateUser.lastName).toBe(mockUser.lastName);
        expect(result.data!.updateUser.email).toBe(mockUser.email);
    });
});

describe("Testing UserModule Filled State", () => {
    let user: User;
    beforeAll(async () => {
        user = await User.create(mockUser);
    });

    afterAll(async () => {
        await sequelize.sync({ force: true });
    });

    it("Should return matched user when fetched by user id", async () => {
        const { schema } = UserModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query user($userId: String!) {
                    user(id: $userId) {
                        firstName
                        lastName
                        email
                        id
                    }
                }
            `,
            variableValues: { userId: user.id },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.user).toBeTruthy();
        expect(result.data!.user.id).toBe(user.id);
        expect(result.data!.user.firstName).toBe(user.getDataValue("firstName"));
        expect(result.data!.user.lastName).toBe(user.getDataValue("lastName"));
        expect(result.data!.user.email).toBe(user.getDataValue("email"));
    });

    it("Should return all users", async () => {
        const { schema } = UserModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query users {
                    users {
                        firstName
                    }
                }
            `,
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.users).toBeTruthy();
        expect(result.data!.users.length).toBeGreaterThanOrEqual(1);
    });
});
