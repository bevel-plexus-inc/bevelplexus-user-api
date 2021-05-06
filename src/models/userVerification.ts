import { UserType } from "@shared/types";
import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class UserVerification extends Model {
    id: string;

    userId: string;

    userType: UserType;

    isIdentityVerified: boolean;

    identityDocumentUrl: string;

    isSchoolEnrollmentVerified: boolean;

    enrollmentDocumentUrl: string;

    isPhoneNumberVerified: boolean;

    isEmailVerified: boolean;

    utilityBillUrl: string;

    isUtilityBillVerified: boolean;

    level: number;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt: Date;
}

UserVerification.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type:       DataTypes.UUID,
        allowNull:  false,
        references: {
            model: "users",
            key:   "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    userType: {
        type:      DataTypes.ENUM("Regular", "Student"),
        allowNull: false,
    },
    isIdentityVerified: {
        type:         DataTypes.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
    },
    identityDocumentUrl: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    isSchoolEnrollmentVerified: {
        type:         DataTypes.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
    },
    enrollmentDocumentUrl: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    isPhoneNumberVerified: {
        type:         DataTypes.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
    },
    utilityBillUrl: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    isUtilityBillVerified: {
        type:         DataTypes.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
    },
    isEmailVerified: {
        type:         DataTypes.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
    },
    level: {
        type:         DataTypes.INTEGER,
        allowNull:    false,
        defaultValue: 0,
    },
    createdAt: {
        allowNull:    false,
        type:         DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        allowNull:    false,
        type:         DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deletedAt: {
        allowNull: true,
        type:      DataTypes.DATE,
    },
}, {
    paranoid:    true,
    sequelize:   seq,
    tableName:   "user_verifications",
    timestamps:  true,
    underscored: true,
});
