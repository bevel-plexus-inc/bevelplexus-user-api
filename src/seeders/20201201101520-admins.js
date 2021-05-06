const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;

module.exports = {
    up: queryInterface => queryInterface.bulkInsert("admins", [
        {
            id:         uuid(),
            name:       "Test",
            email:      "test@test.com",
            password:   bcrypt.hashSync("password", 12),
            role_id:    "17c71b4b-2e9b-4eb3-a838-0860f0d2c9a0",
            created_at: new Date(),
            updated_at: new Date(),
        },
    ]),

    down: queryInterface => queryInterface.bulkDelete("admin", null, {}),
};
