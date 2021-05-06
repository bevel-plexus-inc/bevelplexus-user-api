import { DataTypes, Model } from "sequelize";
import { UserType } from "../shared/types";
import seq from "./index";

export default class PushNotification extends Model {
    id: string;

    country: string;

    countryIso3Code: string;

    userType: UserType;

    message: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}

PushNotification.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    country: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    countryIso3Code: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    userType: {
        type:      DataTypes.ENUM("Regular", "Student"),
        allowNull: false,
    },
    message: {
        type:      DataTypes.TEXT,
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
    tableName:   "push_notifications",
    timestamps:  true,
    underscored: true,
});
