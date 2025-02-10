//Import env credentials
require('dotenv').config();

// app.js
const express = require('express');
const multer = require('multer');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT;

// Using multer library to manage request-body data
// const upload = multer();
// app.use(upload.none());

app.set("json spaces", 2);
app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', customerRoutes);
app.use('/api', orderRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;