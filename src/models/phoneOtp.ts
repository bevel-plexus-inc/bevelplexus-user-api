import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class PhoneOtp extends Model {
    id: string;

    phoneNumber: string;

    otp: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}

PhoneOtp.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    phoneNumber: {
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
    tableName:   "phone_otps",
    timestamps:  true,
    underscored: true,
});
