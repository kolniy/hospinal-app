import express from "express";
import { body, validationResult } from "express-validator";
import Hospital from "../models/Hospital.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  auth,
  body("email", "Please include a valid email address").isEmail(),
  body("name", "Please enter a password with 6 or more characters")
    .not()
    .isEmpty(),
  body("address", "address not valid").not().isEmpty(),
  body("phone", "phone not valid").not().isEmpty(),
  body("location", "location not valid").not().isEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      const { email, name, address, phone, location } = req.body;
      const hospitalDetails = {
        email,
        name,
        address,
        phone,
        location,
      };
      const hospital = new Hospital(hospitalDetails);
      await hospital.save();
      res.json(hospital);
    } catch (error) {
      console.error(error);
      res.status(500).send("internal server error");
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find({});
    res.json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).send("internal server error");
  }
});

export default router;
