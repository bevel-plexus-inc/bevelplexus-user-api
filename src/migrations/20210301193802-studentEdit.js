module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.removeColumn("student_user_details", "country"),
        queryInterface.removeColumn("student_user_details", "country_iso3_code"),
        queryInterface.removeColumn("student_user_details", "school"),
        queryInterface.addColumn("student_user_details", "institution_id", {
            type:      Sequelize.STRING,
            allowNull: false,
            defaultValue: "id"
        }),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn("student_user_details", "institution_id"),
        queryInterface.addColumn("student_user_details", "country", {
            type:      Sequelize.STRING,
            allowNull: false,
            defaultValue: "University"
        }),
        queryInterface.addColumn("student_user_details", "country_iso3_code", {
            type:      Sequelize.STRING,
            allowNull: false,
            defaultValue: "University"
        }),
        queryInterface.addColumn("student_user_details", "school", {
            type:      Sequelize.STRING,
            allowNull: false,
            defaultValue: "University"
        }),
    ]),
};
