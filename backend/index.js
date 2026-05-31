require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");

const PORT = process.env.PORT || 8000;

const app = express();

app.get("/", (req, res) => {
   res.send({ message: "This is an initial setup" });
});

connectDB()
   .then(() => {
      console.log("Connected to database successfully!");
      app.listen(PORT, () => {
         console.log(`Server started and listening on port ${PORT}`);
      });
   })
   .catch((err) => {
      console.log("Database connection failed: " + err.message);
   });