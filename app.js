const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");

// Initialize app
const app = express();

// Connect to Database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to the Database"))
  .catch((err) => console.log("Database connection error", err));

// Global middlewares (to be used on all routes)
app.use(morgan("dev"));

// JSON data's limit by default is 1mb
app.use(bodyParser.json({ limit: "5mb", type: "application/json" }));
app.use(cookieParser());

// Wildcard cors - anyone domain has access
// to the application
app.use(cors());

// Restrict cors - only specified domains
// have access to the application
// app.use(cors({ origin: process.env.CLIENT_URL }));

app.use("/api", postRoutes);
app.use("/api", authRoutes);

// express-jwt middleware for handling
// unauthorized error when accessing protected routes
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({error:"Unauthorized access"})
  }
})

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));
