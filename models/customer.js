const db = require('./db');
const tableName = "Customers";

class Customer {
    constructor(id, firstName, lastName, email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    add(callback) {
        const query = 'INSERT INTO '+tableName+' (firstName, lastName, email) VALUES (?, ?, ?)';
        db.query(query, [this.firstName, this.lastName, this.email], (err, results) => {
            if (err) {
                return callback(err);
            }
            this.id = results.insertId;
            callback(null, { id: this.id, firstName: this.firstName, lastName : this.lastName, email: this.email });
        });
    }

    static get(id, callback) {
        const query = 'SELECT * FROM '+tableName+' WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            if (results.length > 0) {
                const customer = new Customer(results[0]["Id"], results[0]["FirstName"], results[0]["LastName"], results[0]["Email"]);
                callback(null, customer);
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
            const customers = results.map(row => new Customer(row["Id"], row["FirstName"], row["LastName"], row["Email"]));
            callback(null, customers);
        });
    }

    update(callback) {
        const query = 'UPDATE '+tableName+' SET firstName = ?, lastName = ?, email = ? WHERE id = ?';
        db.query(query, [this.firstName, this.lastName, this.email, this.id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.id, firstName: this.firstName, lastName : this.lastName, email: this.email });
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

module.exports = Customer;