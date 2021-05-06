module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("users", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        first_name: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type:      Sequelize.STRING,
            unique:    true,
            allowNull: false,
        },
        password: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        phone_number: {
            type:      Sequelize.STRING,
            unique:    true,
            allowNull: true,
        },
        user_type: {
            type:      Sequelize.ENUM('Regular', 'Student'),
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

    down: queryInterface => queryInterface.dropTable("users"),
};
