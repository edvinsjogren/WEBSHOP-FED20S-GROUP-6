require("dotenv").config();

const database = process.env.DATABASE_URL;
const databasePort = process.env.PORT;

module.exports = {
  database,
  databasePort,
};
