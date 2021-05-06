import Admin from "@models/admin";
import Role from "@models/role";
import User from "@models/user";
import { GenericRole } from "@shared/types";
import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";

interface ContextRequest {
    req: Request;
    user?: User | null;
    admin?: Admin | null | string;
}

export function getToken(payload: { id: string, countryId: string, role?: string }): string {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("Internal server error: environment setup");
    }

    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: "3h" },
    );
}

export function isPasswordEqual(password: string, encryptedPassword: string): boolean {
    return bcrypt.compareSync(password, encryptedPassword);
}

export function getEncryptedPassword(password: string): string {
    const saltNumber = 10;
    const salt = bcrypt.genSaltSync(saltNumber);

    return bcrypt.hashSync(password, salt);
}

export function isTokenExpired(token: string): boolean {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("Internal server error: environment setup");
    }

    try {
        jwt.verify(token, JWT_SECRET);

        return false;
    } catch (e) {
        return true;
    }
}

export async function authResolver({ req }: { req: Request }): Promise<ContextRequest> {
    if (!req.headers || (!req.headers.apikey && !req.headers.authorization)) {
        return { req };
    }

    if (req.headers.apikey && process.env.APP_KEY) {
        return {
            req,
            // tslint:disable-next-line:tsr-detect-possible-timing-attacks
            admin: req.headers.apikey === process.env.APP_KEY ? process.env.APP_KEY : undefined,
        };
    }

    const tokenArray: Array<string> = req.headers.authorization!.split(" ");
    const tokenArrayLength = 2;
    // tslint:disable-next-line:tsr-detect-possible-timing-attacks
    if (tokenArray.length !== tokenArrayLength) {
        return { req };
    }

    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("Internal server error: environment setup");
    }
    const token = tokenArray[1];
    if (isTokenExpired(token)) {
        return { req };
    }

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    const decodedToken: { id: string, role?: string } = jwt.verify(token, JWT_SECRET);

    if (decodedToken.role) {
        const admin = await Admin.findOne({
            where:   { id: decodedToken.id },
            include: [
                {
                    model: Role,
                    as:    "role",
                },
            ],
            raw: true,
        });

        return {
            req,
            admin,
        };
    }
    const user = await User.findOne({
        where:      { id: decodedToken.id },
        attributes: [
            "id", "firstName", "lastName", "email", "phoneNumber",
            "referralCode", "userType", "createdAt", "updatedAt", "deletedAt",
        ],
        raw: true,
    });

    return {
        req,
        user,
    };
}

export function authorizationChecker(
    { context: { user, admin } }: { context: ContextRequest},
    roles: Array<GenericRole>,
): boolean {
    if (roles.length && roles.some(role => role === GenericRole.Admin)) {
        if (admin) {
            return true;
        }
        throw new AuthenticationError("Authentication error");
    }

    if (user || admin) {
        return true;
    }
    throw new AuthenticationError("Authentication error");
}
