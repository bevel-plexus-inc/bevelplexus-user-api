module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn("bank_infos", "bank_code", {
        type:      Sequelize.STRING,
        allowNull: false,
    }),

    down: queryInterface => queryInterface.removeColumn("bank_infos", "bank_code"),
};
