module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("push_notifications", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        country: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        country_iso3_code: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        user_type: {
            type:      Sequelize.ENUM('Regular', 'Student'),
            allowNull: false,
        },
        message: {
            type:      Sequelize.TEXT,
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

    down: queryInterface => queryInterface.dropTable("push_notifications"),
};
