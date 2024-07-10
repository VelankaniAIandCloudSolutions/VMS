// authMiddleware.js

const db = require("../../../../models"); // Your Sequelize models import

const authMiddleware = async (req, res, next) => {
  // Check for token in cookies or headers
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch user from database
  const user = await db.User.findByPk(decoded.userId);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user; // Attach user object to request
  req.role = decoded.role; // Attach role to request

  next();
};

module.exports = authMiddleware;
