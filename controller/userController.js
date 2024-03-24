// controller/userController.js
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userController = {};
const fs = require("fs");
const bcrypt = require('bcryptjs');
const firebase = require('../firebase.js');
const { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } = require('firebase/firestore');

const db = getFirestore(firebase);

//register
userController.registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let valid = true;
    if (password.length < 8 || password === password.toUpperCase() || password === password.toLowerCase() || !/\d/.test(password)) {
      valid = false;
    }

    const userRef = collection(db, 'users');
    const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

    if (!querySnapshot.empty) {
      throw new Error('Email already registered');
    }

    if (!valid) {
      throw new Error("Password invalid");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      email: email,
      password: hashedPassword,
      role: role
    };

    await addDoc(collection(db, 'users'), userData);

    res.status(201).json({ code: 201, status: "Created" });
  } catch (error) {
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};


userController.loginUserAuth = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Cari pengguna berdasarkan email
    const userRef = collection(db, 'users');
    const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

    if (querySnapshot.empty) {
      throw new Error('Invalid email or password');
    }

    // Ambil data pengguna pertama dari hasil pencarian
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Periksa kecocokan password
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Jika password valid, buat token JWT
    const token = jwt.sign({ id: userDoc.id, email: userData.email }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ status: 'success', token });
  } catch (error) {
    res.status(401).json({ status: 'error', message: error.message });
  }
}


module.exports = userController;