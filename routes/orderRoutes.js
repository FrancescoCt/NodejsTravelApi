const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

//Manage CORS Policy
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

router.post('/orders', orderController.createOrder);
router.post('/orders/:id/addCustomer', orderController.addCustomer);
router.post('/orders/:id/addProduct', orderController.addProduct);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.updateOrder);
router.put('/orders/:id/updateCustomer', orderController.updateCustomerOrder);
router.put('/orders/:id/updateProduct', orderController.updateProductOrder);
router.delete('/orders/:id', orderController.deleteOrder);
router.delete('/orders/:id/deleteCustomer', orderController.deleteCustomerOrder);
router.delete('/orders/:id/deleteProduct', orderController.deleteProductOrder);

module.exports = router;
