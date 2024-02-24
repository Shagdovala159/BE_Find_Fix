const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/faiz', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

app.use(express.json());

app.use('/user', userRoutes);
app.use('/product', userRoutes);
app.get("/", (req, res, next) => {
  res.json("API is online");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});