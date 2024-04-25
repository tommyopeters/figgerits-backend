const express = require("express");
const cors = require("cors");

const quotesRoute = require("./src/routes/QuotesRoute");

const PORT = 8000;

const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/", quotesRoute);

app.listen(PORT, () => {
    console.log(`server run on port ${PORT} ✅`);
});