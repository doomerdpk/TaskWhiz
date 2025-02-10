const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Application is running on http://localhost:${PORT}`);
});
