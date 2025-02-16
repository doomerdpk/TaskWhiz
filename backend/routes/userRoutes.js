const express = require("express");
const { readFile, writeFile } = require("../utils/fileUtils");
const { userNameCheck, passwordCheck } = require("../utils/checks");
const path = require("path");
const jwt = require("jsonwebtoken");

const envPath = path.join(__dirname, "../../.env");
require("dotenv").config({ path: envPath });

const usersPath = path.join(__dirname, "../../data/users.json");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({
        error: "Please provide your username and password to signup!",
      });
    }

    if (!userNameCheck(username) || !passwordCheck(password)) {
      return res.status(400).json({
        error:
          "Username must be of 6 to 15 characters containing a capital letter, a small letter and a number and Password must be of 8 to 25 characters containing a capital letter, a small letter, a number and a special character!",
      });
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
        message: "You have successfully signed up!..Login to access your todos",
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
      error: "Unexpected Server Error!",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({
        error: "Please provide your username and password to signin!",
      });
    }

    const data = await readFile(usersPath);
    const users = JSON.parse(data);

    const user = users.some((user) => user.username === username);

    if (!user) {
      return res.status(400).json({
        error: "User doesn't exists..Please sign up!",
      });
    }

    const userExists = users.some(
      (user) => user.username === username && user.password === password
    );

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables!");
      return res
        .status(500)
        .json({ error: "Server misconfiguration. Contact support!" });
    }

    if (userExists) {
      const token = jwt.sign(
        {
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        message: "You have Successfully signed-in!",
        username,
        token,
      });
    } else {
      res.status(401).json({
        error: "Invalid username or password.",
      });
    }
  } catch (err) {
    console.error("Error Ocuured:", err);
    res.status(500).json({
      error: "Unexpected Server Error!",
    });
  }
});

module.exports = router;
