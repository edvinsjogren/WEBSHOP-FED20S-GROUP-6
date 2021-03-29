require("dotenv").config();

const database = process.env.DATABASE_URL;
const databasePort = process.env.PORT;
const flashKey = process.env.FLASH_KEY;
const secretKey = process.env.SECRET_KEY;
const nodeMailerPassword = process.env.NODEMAILER_PASS;
const nodeMailerUser = process.env.NODEMAILER_USER;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

module.exports = {
  database,
  databasePort,
  flashKey,
  secretKey,
  nodeMailerPassword,
  nodeMailerUser,
  stripeSecretKey,
  stripePublicKey
};
