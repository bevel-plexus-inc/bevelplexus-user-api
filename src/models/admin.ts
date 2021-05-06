import { DataTypes, Model } from "sequelize";
import seq from "./index";
import Role from "./role";

export default class Admin extends Model {
    id: string;

    roleId: string;

    name: string;

    email: string;

    password: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt: Date;

    readonly role: Role;
}

Admin.init({
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
    name: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    email: {
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
    tableName:   "admins",
    timestamps:  true,
    underscored: true,
});

Admin.belongsTo(Role, { as: "role" });
