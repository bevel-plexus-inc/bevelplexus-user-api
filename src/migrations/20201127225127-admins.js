module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("admins", {
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
        name: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        email: {
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
        deleted_at: {
            allowNull:    true,
            type:         Sequelize.DATE
        },
    }),

    down: queryInterface => queryInterface.dropTable("admins"),
};
