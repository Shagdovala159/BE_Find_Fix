// controller/userController.js
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userController = {};
const fs = require("fs");
const bcrypt = require('bcryptjs');

//register
userController.registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let valid = true;

    if (password.length < 8 || password === password.toUpperCase() || password === password.toLowerCase() || !/\d/.test(password)) {
      valid = false;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already registered');
    }

    if (!valid) {
      throw new Error("Password invalid");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, role });

    res.status(201).json({ code: 201, status: "Created" });
  } catch (error) {
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};

userController.loginUserAuth = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign({ id: user._id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });
        res.status(200).json({ status: 'success', token });
    } catch (error) {
        res.status(401).json({ status: 'error', message: error.message });
    }
}

module.exports = userController;