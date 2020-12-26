const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//REGISTER
router.post("/register", async (req, res) => {
  //Checking if the user is already in the db
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
    //res.send({user._id})
  } catch (err) {
    res.status(400).send(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  //Checking email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");

  //Checking password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  //Create and assign a token
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.send(token);
});

module.exports = router;
