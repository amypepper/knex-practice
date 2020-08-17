const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

console.log(knexInstance("shopping_list").select("*").toQuery());
