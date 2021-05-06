module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn("student_user_details", "country_id", {
        type:      Sequelize.STRING,
        allowNull: false,
    }),

    down: queryInterface => queryInterface.removeColumn("student_user_details", "country_id"),
};
