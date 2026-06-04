require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const { corsOrigin } = require("./config/config");
const venueRoutes = require("./routes/venue");
const categoryRoutes = require("./routes/category");
const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 8000;

const app = express();

// Allow the frontend origin(s) to call the API from the browser.
app.use(cors({ origin: corsOrigin.split(",").map((o) => o.trim()) }));
app.use(express.json());

app.use("/auth", authRoutes);
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