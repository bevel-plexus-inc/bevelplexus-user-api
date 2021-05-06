module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn("account_reset_users", "form_token", {
    type:      Sequelize.TEXT,
    allowNull: true,
  }),

  down: queryInterface => queryInterface.removeColumn("account_reset_users", "form_token"),
};
