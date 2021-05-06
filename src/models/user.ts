import AccountResetUser from "@models/accountResetUser";
import Recipient from "@models/recipient";
import RegularAccountDetail from "@models/regularAccountDetail";
import StudentAccountDetail from "@models/studentAccountDetail";
import UserKyc from "@models/userKyc";
import UserVerification from "@models/userVerification";
import { UserType } from "@shared/types";
import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class User extends Model {
    id: string;

    firstName: string;

    lastName: string;

    email: string;

    password: string;

    phoneNumber: string;

    referralCode?: string;

    userType: UserType;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt: Date;

    readonly studentAccountDetail?: StudentAccountDetail;

    readonly regularAccountDetail?: RegularAccountDetail;

    readonly userVerification: UserVerification;

    readonly accountResetUser?: AccountResetUser;

    readonly userKyc?: UserKyc;

    readonly recipient: Array<Recipient>;
}

User.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type:      DataTypes.STRING,
        unique:    true,
        allowNull: false,
    },
    password: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type:      DataTypes.STRING,
        unique:    true,
        allowNull: true,
    },
    referralCode: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    userType: {
        type:      DataTypes.ENUM("Regular", "Student"),
        allowNull: false,
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
    tableName:   "users",
    timestamps:  true,
    underscored: true,
});

User.hasOne(StudentAccountDetail, { as: "studentAccountDetail", foreignKey: "userId" });
User.hasOne(RegularAccountDetail, { as: "regularAccountDetail", foreignKey: "userId" });
User.hasOne(UserVerification, { as: "userVerification", foreignKey: "userId" });
User.hasOne(AccountResetUser, { as: "accountResetUser", foreignKey: "userId" });
User.hasOne(UserKyc, { as: "userKyc", foreignKey: "userId" });
UserKyc.belongsTo(User, { as: "user" });
User.hasMany(Recipient, { as: "recipient" });
