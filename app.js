const express = require("express");
const morgan = require("morgan");
const app = express();

// Import routes
const {getPosts} = require("./routes/post")


app.use(morgan("dev"));

app.use("/", getPosts )

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));
