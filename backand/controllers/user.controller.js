import User from "../models/userModel.js";
import { registerSchema } from "../validators/userValidation.js";
import { loginSchema } from "../validators/userValidation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET

export const signup = async (req, resp) => {
  try {

    // Zod validation
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return resp.status(400).json({
        success: false,
        error: result.error.issues
      });
    }

    // validated data from Zod
    const { name, email, password } = result.data;

    // check if user exists
    const exist = await User.findOne({ email });

    if (exist) {
      return resp.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });



    return resp.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
   
    });

  } catch (error) {
    console.log("Signup failed:",error)
    return resp.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const login = async (req, resp) => {
  try {
    // 1️⃣ Validate request body with Zod
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return resp.status(400).json({
        success: false,
        error: result.error.issues
      });
    }

    // 2️⃣ Get validated data
    const { email, password } = result.data;

    // 3️⃣ Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 4️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return resp.status(401).json({
        success: false,
        message: "Invalid Credintials"
      });
    }

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" } // valid for 7 days
    );

    
    

    return resp.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token
    });

  } catch (error) {
    console.log("Login failed:", error);
    return resp.status(500).json({
      success: false,
      message: error.message
    });
  }
};