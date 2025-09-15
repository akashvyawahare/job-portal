import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "user is not authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "invalid token",
        success: false,
      });
    }
    req.id = decode.userId;
    next(); // after executing this method only, the flow goes to processing the request
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;
