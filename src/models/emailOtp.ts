import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class EmailOtp extends Model {
    id: string;

    email: string;

    otp: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}

EmailOtp.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    email: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    otp: {
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
    sequelize:   seq,
    tableName:   "email_otps",
    timestamps:  true,
    underscored: true,
});
