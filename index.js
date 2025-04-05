require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/user');
const farmerRouter = require('./routes/farmer');
const bannerRouter = require('./routes/banner');
const categoryRouter = require('./routes/category');
const subcategoryRouter = require('./routes/sub_category');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(farmerRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subcategoryRouter);
app.use(productRouter);
app.use(orderRouter);

mongoose.connect(process.env.DATABASE).then(() => {
    console.log("MongoDB connection successful");
})

app.listen(PORT,"0.0.0.0",function(){
    console.log(`Server is running on port ${PORT}`);
});