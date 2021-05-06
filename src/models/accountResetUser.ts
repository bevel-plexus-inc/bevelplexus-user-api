import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class AccountResetUser extends Model {
  id: string;

  userId: string;

  email: string;

  phoneNumber: string;

  token: string;

  formToken?: string;

  expiringDate: Date;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}

AccountResetUser.init({
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
    email: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    formToken: {
        type:      DataTypes.TEXT,
        allowNull: true,
    },
    expiringDate: {
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
}, {
    sequelize:   seq,
    tableName:   "account_reset_users",
    timestamps:  true,
    underscored: true,
});
