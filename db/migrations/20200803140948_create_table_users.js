exports.up = function (knex) {
  // console.log("creating users table...");
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.string("username").unique().primary().notNullable();
    usersTable.text("avatar_url");
    usersTable.text("name").notNullable();
  });
};

exports.down = function (knex) {
  // console.log("removing users table...");
  return knex.schema.dropTable("users");
};
