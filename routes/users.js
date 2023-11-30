const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        type: user.type,
      },
      secret,
      { expiresIn: null }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      user: user,
      token: token,
    });
  } else {
    res.status(400).send("password is wrong!");
  }
});

module.exports = router;
