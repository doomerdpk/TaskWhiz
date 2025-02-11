const express = require("express");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env");
require("dotenv").config({
  path: envPath,
});

const dataPath = path.join(__dirname, "../data");
const usersPath = path.join(__dirname, "../data/users.json");
const usersDataPath = path.join(__dirname, "../data/usersData");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
  console.log("data folder created successfully...");
}

if (!fs.existsSync(usersPath)) {
  fs.writeFileSync(usersPath, "[]", "utf-8");
  console.log("Users file created successfully..");
}

if (!fs.existsSync(usersDataPath)) {
  fs.mkdirSync(usersDataPath, { recursive: true });
  console.log("userData folder created successfully...");
}

const app = express();

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/todo", todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Application is running on http://localhost:${PORT}`);
});
