module.exports = {
    up: queryInterface => queryInterface.bulkInsert("roles", [
        {
            name:       "Admin",
            id:         "17c71b4b-2e9b-4eb3-a838-0860f0d2c9a0",
            created_at: new Date(),
            updated_at: new Date(),
        },
    ]),

    down: queryInterface => queryInterface.bulkDelete("roles", null, {}),
};
