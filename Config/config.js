require("dotenv").config();

const database = process.env.DATABASE_URL;
const databasePort = process.env.PORT;
const flashKey = process.env.FLASH_KEY;

module.exports = {
  database,
  databasePort,
  flashKey
};
