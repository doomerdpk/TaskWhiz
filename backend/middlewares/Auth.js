const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "../../env",
});

const authUser = (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      res.status(400).json({
        error: "Request Denied...",
      });
      return;
    }

    const verifiedData = jwt.verify(token, process.env.JWT_SECRET);

    if (verifiedData.username) {
      req.username = verifiedData.username;
      next();
    }
  } catch (err) {
    console.error("Error Occured:", err);
    res.status(500).json({
      error: "Unexpected Error occured...",
    });
  }
};

module.exports = authUser;
