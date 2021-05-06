module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("student_user_details", {
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
        student_number: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        student_email: {
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
        school: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        year_of_graduation: {
            type:      Sequelize.DATE,
            allowNull: false,
        },
        course: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        date_of_birth: {
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
        },
        deleted_at: {
            allowNull:    true,
            type:         Sequelize.DATE
        },
    }),

    down: queryInterface => queryInterface.dropTable("student_user_details"),
};
