const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const quotesRoute = require("./src/routes/QuotesRoute");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", quotesRoute);

mongoose.connect(`mongodb+srv://figgeritsdb.ujqbmrg.mongodb.net/test?retryWrites=true`, {
  user: process.env.MONGO_DB_USERNAME,
  pass: process.env.MONGO_DB_PASSWORD,
  dbName: "test",
})
  .then(() => {
    console.log("Connected to the database ✅");
    app.listen(PORT, () => {
      console.log(`server run on port ${PORT} ✅`);
    });
  })
  .catch((err) => {
    console.log(`An error occurred while connecting to the database: ${err} ❌`);
  })