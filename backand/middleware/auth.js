import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const token = authHeader.split(" ")[1];

  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token missing"
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("JWT verification failed:", error);

    return res.status(401).json({
      success: false,
      message: "Token invalid or expired"
    });
  }
};

export default authMiddleware;