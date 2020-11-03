const express = require("express");
const connectDb = require("./config/db");
const app = express();
const path = require("path");

// connect db
connectDb();
// Init middleware for getting request object value
//
app.use(express.json({ extended: false })); // to get the request

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build")),
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`\nServer starts at ${PORT}\n`));
