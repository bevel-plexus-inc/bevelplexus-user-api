module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn("user_verifications", "utility_bill_url", {
            type:      Sequelize.STRING,
            allowNull: true,
        }),
        queryInterface.addColumn("user_verifications", "is_utility_bill_verified", {
            type:      Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }),
        queryInterface.addColumn("user_verifications", "level", {
            type:      Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn("user_verifications", "utility_bill_url"),
        queryInterface.removeColumn("user_verifications", "is_utility_bill_verified"),
        queryInterface.removeColumn("user_verifications", "level"),
    ]),
};
