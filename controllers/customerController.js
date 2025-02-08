const Customer = require('../models/customer');

exports.createCustomer = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const customer = new Customer(null, firstName, lastName, email);
    customer.add((err, newCustomer) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({message: "Customer created.", data: newCustomer});
    });
};

exports.getAllCustomers = (req, res) => {
    Customer.getAll((err, customers) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(customers);
    });
};

exports.getCustomerById = (req, res) => {
    Customer.get(parseInt(req.params.id, 10), (err, customer) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).send('Customer not found');
        }
    });
};

exports.updateCustomer = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const customer = new Customer(parseInt(req.params.id, 10), firstName, lastName, email);
    customer.update((err, updatedCustomer) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({message: "Customer updated.", data: updatedCustomer});
    });
};

exports.deleteCustomer = (req, res) => {
    const customer = new Customer(parseInt(req.params.id, 10));
    customer.delete((err, success) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (success) {
            res.json({ message: 'Customer deleted.' });
        } else {
            res.status(404).send('Customer not found');
        }
    });
};
