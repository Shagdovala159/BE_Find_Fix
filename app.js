const express = require('express');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.use('/user', userRoutes);
app.use('/services', serviceRoutes);
app.use('/orders', orderRoutes);
app.get("/", (req, res, next) => {
  res.json("API is online");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});