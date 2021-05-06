module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.removeColumn("regular_user_details", "country"),
        queryInterface.removeColumn("regular_user_details", "country_iso3_code"),
        queryInterface.addColumn("regular_user_details", "country_id", {
            type:      Sequelize.STRING,
            allowNull: false,
        }),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn("regular_user_details", "country_id"),
        queryInterface.addColumn("regular_user_details", "country", {
            type:      Sequelize.STRING,
            allowNull: false,
            defaultValue: "Nigeria"
        }),
        queryInterface.addColumn("regular_user_details", "country_iso3_code", {
            type:      Sequelize.STRING,
            allowNull: false,
            defaultValue: "NGN"
        }),
    ]),
};
