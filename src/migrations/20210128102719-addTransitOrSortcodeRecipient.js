module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn("bank_infos", "transit_or_sort_code", {
        type:      Sequelize.STRING,
        allowNull: true,
    }),

    down: queryInterface => queryInterface.removeColumn("bank_infos", "transit_or_sort_code"),
};
