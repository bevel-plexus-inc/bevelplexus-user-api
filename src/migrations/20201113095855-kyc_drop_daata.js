module.exports = {
    up: queryInterface => Promise.all([
        queryInterface.removeColumn("user_kycs", "reference_id"),
        queryInterface.removeColumn("user_kycs", "match_level"),
    ]),

    down: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn("user_kycs", "reference_id", {
            type:      Sequelize.STRING,
            allowNull: true,
        }),
        queryInterface.addColumn("user_kycs", "match_level", {
            type:      Sequelize.INTEGER,
            allowNull: true,
        }),
    ])
};

