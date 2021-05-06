import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class UserKyc extends Model {
    id: string;

    userId: string;

    status?: string;

    jobId?: string;

    result?: string;

    isVerified: boolean;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}

UserKyc.init({
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
    status: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    result: {
        type:      DataTypes.TEXT,
        allowNull: true,
    },
    jobId: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    isVerified: {
        type:         DataTypes.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
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
    sequelize:   seq,
    tableName:   "user_kycs",
    timestamps:  true,
    underscored: true,
});
