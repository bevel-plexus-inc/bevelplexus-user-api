module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("user_kycs", {
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
        reference_id: {
            type:      Sequelize.STRING,
            allowNull: true,
        },
        match_level: {
            type:      Sequelize.INTEGER,
            allowNull: true,
        },
        is_verified: {
            type:      Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
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

    down: queryInterface => queryInterface.dropTable("user_kycs"),
};
