module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn("user_kycs", "status", {
            type:      Sequelize.STRING,
            allowNull: true,
        }),
        queryInterface.addColumn("user_kycs", "job_id", {
            type:      Sequelize.STRING,
            allowNull: true,
        }),
        queryInterface.addColumn("user_kycs", "result", {
            type:      Sequelize.TEXT,
            allowNull: true,
        }),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn("user_kycs", "status"),
        queryInterface.removeColumn("user_kycs", "job_id"),
        queryInterface.removeColumn("user_kycs", "result"),
    ])
};
