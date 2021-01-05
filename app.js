const express = require("express");
const morgan = require("morgan");
const app = express();

// Import routes
const postRoutes = require("./routes/post")


app.use(morgan("dev"));

app.use("/api", postRoutes )

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));
