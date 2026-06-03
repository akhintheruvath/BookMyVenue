require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const venueRoutes = require("./routes/venue");
const categoryRoutes = require("./routes/category");
const cors = require("cors");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors())
app.use(express.json());

app.use("/api/venues", venueRoutes);
app.use("/api/venueCategories", categoryRoutes);

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