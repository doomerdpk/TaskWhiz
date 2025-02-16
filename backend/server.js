const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const {
  createFileIfNotExists,
  createFolderIfNotExists,
} = require("./utils/fileUtils");
const cors = require("cors");

const dataPath = path.resolve(__dirname, "../data");
const usersPath = path.join(dataPath, "users.json");
const usersDataPath = path.join(dataPath, "usersData");

const connectDB = async () => {
  try {
    await createFolderIfNotExists(dataPath);
    await createFileIfNotExists(usersPath);
    await createFolderIfNotExists(usersDataPath);
  } catch (error) {
    console.error("Error occured!", error);
    process.exit(1);
  }
};

const app = express();

app.use(express.json());

app.use(cors());

try {
  const userRoutes = require("./routes/userRoutes");
  const todoRoutes = require("./routes/todoRoutes");
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/todo", todoRoutes);
} catch (error) {
  console.error("Error loading routes:", error);
  process.exit(1);
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Unexpected Error Occured!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log("Successfully connected to the database!");
  console.log(`Application is running on http://localhost:${PORT}`);
});
