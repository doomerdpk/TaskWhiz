const jwt = require("jsonwebtoken");
require("dotenv").config();

const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Request Denied!" });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables.");
      return res
        .status(500)
        .json({ error: "Server misconfiguration. Contact support." });
    }

    const verifiedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifiedData || !verifiedData.username) {
      return res.status(403).json({ error: "Invalid token!" });
    }

    req.username = verifiedData.username;
    next();
  } catch (err) {
    console.error("Error Occured:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Request Denied!" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Request Denied!" });
    }
    return res.status(500).json({ error: "Unexpected error occurred." });
  }
};

module.exports = authUser;
