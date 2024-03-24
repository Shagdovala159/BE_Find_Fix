const express = require('express');
const userRoutes = require('./routes/userRoutes');
//const productRoutes = require('./routes/productRoutes');
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.use('/user', userRoutes);
//app.use('/product', userRoutes);
app.get("/", (req, res, next) => {
  res.json("API is online");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});