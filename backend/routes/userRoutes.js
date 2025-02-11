const express = require("express");
const { readFile, writeFile } = require("../utils/fileUtils");
const { userNameCheck, passwordCheck } = require("../utils/checks");
const path = require("path");
const jwt = require("jsonwebtoken");

const envPath = path.join(__dirname, "../../.env");
require("dotenv").config({
  path: envPath,
});

const usersPath = path.join(__dirname, "../../data/users.json");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.status(400).json({
        error: "Please provide your username and password to signup!",
      });
      return;
    }

    if (!userNameCheck(username) || !passwordCheck(password)) {
      res.status(400).json({
        error:
          "Username must be of 6 to 10 characters and Password must contain a capital letter, a small letter and a number!",
      });
      return;
    }

    const data = await readFile(usersPath);
    const users = JSON.parse(data);

    const userExists = users.some((user) => user.username === username);

    if (!userExists) {
      users.push({
        username,
        password,
      });

      const usersData = JSON.stringify(users, null, 2);
      await writeFile(usersPath, usersData);

      const userPath = path.join(
        __dirname,
        "../../data/usersData/" + username + ".json"
      );

      await writeFile(userPath, "[]");
      res.status(201).json({
        message: "You have successfully signed up!",
      });
    } else {
      res.status(409).json({
        error:
          "User with provided username already exists.. Please choose another username!",
      });
    }
  } catch (err) {
    console.error("Error Occured:", err);
    res.status(500).json({
      error: "Unexpected error occured...s",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.status(400).json({
        error: "Please provide your username and password to signin!",
      });
      return;
    }

    const data = await readFile(usersPath);
    const users = JSON.parse(data);

    const userExists = users.some(
      (user) => user.username === username && user.password === password
    );

    if (userExists) {
      const token = jwt.sign(
        {
          username,
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({
        message: token,
      });
    } else {
      res.status(400).json({
        error: "Invalid Credientials!",
      });
    }
  } catch (err) {
    console.error("Error Ocuured:", err);
    res.status(500).json({
      error: "Unexpected error occured...",
    });
  }
});

module.exports = router;
