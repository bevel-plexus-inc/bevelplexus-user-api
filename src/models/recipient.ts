import Transaction from "@shared/transaction";
import { DataTypes, Model } from "sequelize";
import BankInfo from "./bankInfo";
import seq from "./index";

export default class Recipient extends Model {
    id: string;

    name: string;

    userId: string;

    email: string;

    phoneNumber: string;

    location: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt: Date;

    readonly bankInfo: Array<BankInfo>;

    readonly transaction?: Transaction;
}

Recipient.init({
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
    name: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type:      DataTypes.STRING,
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
    tableName:   "recipients",
    timestamps:  true,
    underscored: true,
});

Recipient.hasMany(BankInfo, { as: "bankInfo" });
BankInfo.belongsTo(Recipient, { as: "recipient" });
