import Country from "@shared/country";
import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class RegularAccountDetail extends Model {
    id: string;

    userId: string;

    address: string;

    city: string;

    postalCode: string;

    countryId: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt: Date;

    country?: Country;
}

RegularAccountDetail.init({
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
    address: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    postalCode: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    countryId: {
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
    tableName:   "regular_user_details",
    timestamps:  true,
    underscored: true,
});
