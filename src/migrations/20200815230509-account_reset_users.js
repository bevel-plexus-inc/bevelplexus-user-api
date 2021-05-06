module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("account_reset_users", {
        id: {
            type:      Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        user_id: {
            type:      Sequelize.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        email: {
            type:      Sequelize.STRING,
            allowNull: true,
        },
        phone_number: {
            type:      Sequelize.STRING,
            allowNull: true,
        },
        token: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        expiring_date: {
            type:      Sequelize.DATE,
            allowNull: false,
        },
        created_at: {
            allowNull:    false,
            type:         Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            allowNull:    false,
            type:         Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        }
    }),

    down: queryInterface => queryInterface.dropTable("account_reset_users"),
};
