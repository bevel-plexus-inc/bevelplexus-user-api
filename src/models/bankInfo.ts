import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class BankInfo extends Model {
    id: string;

    recipientId: string;

    bank: string;

    accountNumber: string;

    bankCode: string;

    transitOrSortCode?: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt: Date;
}

BankInfo.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    recipientId: {
        type:       DataTypes.UUID,
        allowNull:  false,
        references: {
            model: "recipients",
            key:   "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    bank: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    bankCode: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    transitOrSortCode: {
        type:      DataTypes.STRING,
        allowNull: true,
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
    tableName:   "bank_infos",
    timestamps:  true,
    underscored: true,
});
