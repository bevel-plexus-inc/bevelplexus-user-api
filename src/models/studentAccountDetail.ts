import Institution from "@shared/institution";
import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class StudentAccountDetail extends Model {
    id: string;

    userId: string;

    studentNumber: string;

    studentEmail: string;

    institutionId: string;

    yearOfGraduation: Date;

    course: string;

    countryId: string;

    dateOfBirth: Date;

    institution?: Institution;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt: Date;
}

StudentAccountDetail.init({
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
    studentNumber: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    countryId: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    studentEmail: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    institutionId: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    yearOfGraduation: {
        type:      DataTypes.DATE,
        allowNull: false,
    },
    course: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type:      DataTypes.DATE,
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
    tableName:   "student_user_details",
    timestamps:  true,
    underscored: true,
});
