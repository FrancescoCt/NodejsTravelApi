const Product = require('../models/product');

exports.createProduct = (req, res) => {
    const name = req.body.name;
    const product = new Product(null, name);
    product.add((err, newProduct) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({message: "Product created.", data: newProduct});
    });
};

exports.getAllProducts = (req, res) => {
    Product.getAll((err, products) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(products);
    });
};

exports.getProductById = (req, res) => {
    Product.get(parseInt(req.params.id, 10), (err, product) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    });
};

exports.updateProduct = (req, res) => {
    const name = req.body.name;
    const product = new Product(parseInt(req.params.id, 10), name);
    product.update((err, updatedProduct) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({message: "Product updated.", data: updatedProduct});
    });
};

exports.deleteProduct = (req, res) => {
    const product = new Product(parseInt(req.params.id, 10));
    product.delete((err, success) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (success) {
            res.json({ message: 'Product deleted.' });
        } else {
            res.status(404).send('Product not found');
        }
    });
};
