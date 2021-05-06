module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("user_verifications", {
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
        user_type: {
            type:      Sequelize.ENUM('Regular', 'Student'),
            allowNull: false,
        },
        is_identity_verified: {
            type:      Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        identity_document_url: {
            type:      Sequelize.STRING,
            allowNull: true,
        },
        is_school_enrollment_verified: {
            type:      Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        enrollment_document_url: {
            type:      Sequelize.STRING,
            allowNull: true,
        },
        is_phone_number_verified: {
            type:      Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_email_verified: {
            type:      Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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

    down: queryInterface => queryInterface.dropTable("user_verifications"),
};
