const db = require('./db');
const tableName = "Products";

class Product {
    constructor(id = null, name = '') {
        this.id = id;
        this.name = name;
    }

    add(callback) {
        const query = 'INSERT INTO '+tableName+' (name) VALUES (?)';
        db.query(query, [this.name], (err, results) => {
            if (err) {
                return callback(err);
            }
            this.id = results.insertId;
            callback(null, { id: this.id, name: this.name });
        });
    }

    static get(id, callback) {
        const query = 'SELECT * FROM '+tableName+' WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            if (results.length > 0) {
                const product = new Product(results[0]["Id"], results[0]["Name"]);
                callback(null, product);
            } else {
                callback(null, null);
            }
        });
    }

    static getAll(callback) {
        const query = 'SELECT * FROM '+tableName+' ORDER BY id';
        db.query(query, (err, results) => {
            if (err) {
                return callback(err);
            }
            const products = results.map(row => new Product(row["Id"], row["Name"]));
            callback(null, products);
        });
    }

    update(callback) {
        const query = 'UPDATE '+tableName+' SET name = ? WHERE id = ?';
        db.query(query, [this.name, this.id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.id, name: this.name });
        });
    }

    delete(callback) {
        const query = 'DELETE FROM '+tableName+' WHERE id = ?';
        db.query(query, [this.id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.affectedRows > 0);
        });
    }
}

module.exports = Product;
