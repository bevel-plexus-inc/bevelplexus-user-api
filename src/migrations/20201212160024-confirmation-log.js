module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("confirmation_logs", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        role_id: {
            type:      Sequelize.UUID,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        admin_id: {
            type:      Sequelize.UUID,
            allowNull: false,
            references: {
                model: "admins",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        user_id: {
            type:      Sequelize.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        user_verification_id: {
            type:      Sequelize.UUID,
            allowNull: false,
            references: {
                model: "user_verifications",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        document_url: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        comment: {
            type:      Sequelize.STRING,
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
        },
    }),

    down: queryInterface => queryInterface.dropTable("confirmation_logs"),
};
