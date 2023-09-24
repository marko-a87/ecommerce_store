import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import { generateToken } from "../util/generateToken.js";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

//returns all user accounts from the admin routes
const findAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  if (users) {
    return res.status(200).json({
      message: "Users exist",
      users_listing: users,
    });
  }
  next();
});

//Finds a specific user account
const findUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  const user = await User.findById({ _id });

  if (user) {
    return res.status(200).json({
      message: "User exist",
      user_listing: user,
    });
  }
  next();
});

//Creates an admin account
const createAdmin = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const adminExists = await Admin.findOne({ name });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({
    name,
    password,
  });

  if (admin) {
    res.status(201).json({
      message: "Admin account created",
      admin_profile: { name, password },
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const admin = await Admin.findOne({ name });
  let token;

  //jwt web token
  token = req.cookies.jwt;

  //Takes jwt as a tag and sets the cookie to 0 so the user can logout

  if (admin && (await admin.matchPassword(password))) {
    if (token) {
      throw new Error("Admin already logged in");
    }
    generateToken(res, admin._id, process.env.ADMIN_SECRET);
    res.status(200).json({
      message: "Admin logged in",

      //Products: Shows listings for products on account
    });
  } else {
    res.status(400);
    throw new Error("Email or password is invalid");
  }
});

const logoutAdmin = asyncHandler(async (req, res) => {
  let token;

  //jwt web token
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ADMIN_SECRET);

      if (decoded) {
        res.cookie("jwt", "", {
          httpOnly: true,
          expires: new Date(0),
        });
        return res.status(200).json({
          message: "Admin logged out",
        });
      }
    } catch (error) {
      res.status(400);
      throw new Error("Not authorized");
    }
  } else {
    res.status(401);
    throw new Error("No admin account to logout");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  const userProfile = await User.findByIdAndDelete({ _id });

  if (userProfile) {
    res.status(200).json({
      message: "User deleted",
    });
  } else {
    res.status(404);
    throw new Error("No user found");
  }
});
export {
  findAllUsers,
  findUser,
  createAdmin,
  loginAdmin,
  logoutAdmin,
  deleteUser,
};
