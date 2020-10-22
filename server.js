const express = require("express");
const connectDb = require("./config/db");
const app = express();

// connect db
connectDb();
// Init middleware for getting request object value
//
app.use(express.json({ extended: false })); // to get the request
app.get("/", (req, res) => res.send("API running"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`\nServer starts at ${PORT}\n`));
