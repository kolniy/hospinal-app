import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();
const tokenSecret = process.env.JWTSECRET;

router.post(
  "/register",
  body("email", "Please include a valid email address").isEmail(),
  body(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password, name } = req.body;
    try {
      const nullUser = await User.findOne({
        email,
      });

      if (nullUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exist's" }] });
      }
      const userDetails = {
        email,
        password,
        name,
      };

      const user = new User(userDetails);

      const salt = await bcrypt.genSalt(10); // generate salt for password
      user.password = await bcrypt.hash(password, salt); // use salt to hash password
      await user.save(); // save user

      // code to create token payload
      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(payload, tokenSecret, { expiresIn: 900 }, (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: user,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("internal server error");
    }
  }
);

router.post(
  "/login",
  body("email", "please include a valid email").isEmail(),
  body("password", "Please enter a password").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "invalid credentials" }],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "invalid credentials" }],
        });
      }

      // code to create token payload
      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        const newUserData = Object.assign(user.toObject(), {});
        delete newUserData.password;
        res.json({
          token,
          user: newUserData,
        });
      });
    } catch (error) {
      res.status(500).send("Server error");
      console.error(error);
    }
  }
);

export default router;
