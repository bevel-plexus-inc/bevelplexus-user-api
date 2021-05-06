module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn("users", "referral_code", {
            type:      Sequelize.STRING,
            allowNull: true,
    }),

    down: queryInterface => queryInterface.removeColumn("users", "referral_code"),
};
