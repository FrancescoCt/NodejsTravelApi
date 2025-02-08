const Order = require('../models/order');

exports.createOrder = (req, res) => {
    const orderDate = req.body.orderDate;
    const order = new Order(null, orderDate);
    order.add((err, newOrder) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({message: "Order created.", data: newOrder});
    });
};

exports.addCustomer = (req, res) => {
    const customerId = req.body.customerId;
    const order = new Order(parseInt(req.params.id, 10), null);
    order.addCustomer((err, newOrder) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({message: "Customer added.", data: newOrder});
    }, parseInt(customerId, 10));//Callback + param
};

exports.addProduct = (req, res) => {
    const productId = req.body.productId;
    const order = new Order(parseInt(req.params.id, 10), null );
    order.addProduct((err, newOrder) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({message: "Product added.", data: newOrder});
    }, parseInt(productId, 10)); //Callback + param
};

exports.getAllOrders = (req, res) => {
    const orderDate = req.query["orderDate"];
    const productId = req.query["productId"];
    Order.getAll((err, orders) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(orders);
    }, orderDate, productId);
};

exports.getOrderById = (req, res) => {
    Order.get(parseInt(req.params.id, 10), (err, order) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (order) {
            res.json(order);
        } else {
            res.status(404).send('Order not found');
        }
    });
};

exports.updateOrder = (req, res) => {
    const orderDate = req.body.orderDate;
    const order = new Order(parseInt(req.params.id, 10), orderDate);
    order.update((err, updatedOrder) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({message: "Order updated.", data: updatedOrder});
    });
};

exports.updateCustomerOrder = (req, res) => {
    const newCustomerId = req.body.newCustomerId;
    const oldCustomerId = req.body.oldCustomerId;
    const order = new Order(parseInt(req.params.id, 10), null);
    order.updateCustomer((err, updatedOrder) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({message: "Order updated.", data: updatedOrder});
    }, parseInt(newCustomerId, 10), parseInt(oldCustomerId, 10)); //Callback+params
};

exports.updateProductOrder = (req, res) => {
    const newProductId = req.body.newProductId;
    const oldProductId = req.body.oldProductId;
    const order = new Order(parseInt(req.params.id, 10), null);
    order.updateProduct((err, updatedOrder) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({message: "Order updated.", data: updatedOrder});
    }, parseInt(newProductId, 10), parseInt(oldProductId, 10)); //Callback+params
};

exports.deleteOrder = (req, res) => {
    const order = new Order(parseInt(req.params.id, 10));
    order.delete((err, success) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (success) {
            res.json({ message: 'Order deleted.' });
        } else {
            res.status(404).send('Order not found');
        }
    });
};

exports.deleteCustomerOrder = (req, res) => {
    const customerId = req.body.customerId;
    const order = new Order(parseInt(req.params.id, 10));
    order.deleteCustomer((err, success) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (success) {
            res.json({ message: 'Customer deleted from Order.' });
        } else {
            res.status(404).send('Order not found');
        }
    }, parseInt(customerId, 10));
};

exports.deleteProductOrder = (req, res) => {
    const productId = req.body.productId;
    const order = new Order(parseInt(req.params.id, 10));
    order.deleteProduct((err, success) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (success) {
            res.json({ message: 'Product deleted from Order.' });
        } else {
            res.status(404).send('Order not found');
        }
    }, parseInt(productId, 10));
};
