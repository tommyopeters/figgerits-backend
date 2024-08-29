const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const admin = require('firebase-admin')

dotenv.config();

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountBase64) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
}

const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf-8'));

const puzzlesRoute = require("./src/routes/PuzzlesRoute");
const authRoute = require("./src/routes/AuthRoute");

const PORT = process.env.PORT || 8000;

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const corsOptions = {
  origin: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authenticate = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.userId = decodedToken.uid;
    console.log(decodedToken)
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).send('Unauthorized');
  }
};

app.use("/", authRoute);
app.use("/api", authenticate, puzzlesRoute);

mongoose.connect(`mongodb+srv://figgeritsdb.ujqbmrg.mongodb.net/figgerits?retryWrites=true`, {
  user: process.env.MONGO_DB_USERNAME,
  pass: process.env.MONGO_DB_PASSWORD,
  dbName: "figgerits",
})
  .then(() => {
    console.log("Connected to the database ✅");
    app.listen(PORT, () => {
      console.log(`server run on port ${PORT} ✅`);
    });


    // // Script to update many documents
    // const updateDocuments = async () => {
    //   const db = mongoose.connection.db;
    //   const collection = db.collection('puzzles'); // Replace with your collection name

    //   const pipeline = [
    //     {
    //       $set: {
    //         clues: {
    //           $map: {
    //             input: "$clues",
    //             as: "clue",
    //             in: {
    //               word: "$$clue.word",
    //               clue: "$$clue.hint"
    //             }
    //           }
    //         }
    //       }
    //     }
    //   ];

    //   try {
    //     const result = await collection.updateMany({}, pipeline);
    //     console.log('Documents updated:', result.modifiedCount);
    //   } catch (error) {
    //     console.error('Error updating documents:', error);
    //   }
    // };

    // // Call the update function
    // updateDocuments();

  })
  .catch((err) => {
    console.log(`An error occurred while connecting to the database: ${err} ❌`);
  })