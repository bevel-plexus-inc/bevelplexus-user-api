import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class ConfirmationLog extends Model {
    id: string;

    roleId: string;

    adminId: string;

    userId: string;

    userVerificationId: string;

    documentUrl: string;

    comment: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}

ConfirmationLog.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    roleId: {
        type:       DataTypes.UUID,
        allowNull:  false,
        references: {
            model: "roles",
            key:   "id",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
    },
    adminId: {
        type:       DataTypes.UUID,
        allowNull:  false,
        references: {
            model: "admins",
            key:   "id",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
    },
    userId: {
        type:       DataTypes.UUID,
        allowNull:  false,
        references: {
            model: "users",
            key:   "id",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
    },
    userVerificationId: {
        type:       DataTypes.UUID,
        allowNull:  false,
        references: {
            model: "user_verifications",
            key:   "id",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
    },
    documentUrl: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    comment: {
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
}, {
    paranoid:    true,
    sequelize:   seq,
    tableName:   "confirmation_logs",
    timestamps:  true,
    underscored: true,
});
