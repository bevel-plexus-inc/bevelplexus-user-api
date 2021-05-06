module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("regular_user_details", {
        id: {
            type:          Sequelize.UUID,
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
        address: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        city: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        postal_code: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        country: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        country_iso3_code: {
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

    down: queryInterface => queryInterface.dropTable("regular_user_details"),
};
