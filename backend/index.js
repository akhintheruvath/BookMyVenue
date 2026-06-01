require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const venueRoutes = require("./routes/venue");
const categoryRoutes = require("./routes/category");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());

app.use("/venues", venueRoutes);
app.use("/venueCategories", categoryRoutes);

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