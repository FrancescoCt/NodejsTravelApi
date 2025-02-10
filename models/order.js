const db = require('./db');
const Customer = require('../models/customer');
const Product = require('../models/product');

const tableName = "Orders";
const relationCustomer = "OrderCustomers";
const relationProduct = "OrderProducts";

class Order {

    constructor(id, orderDate, customers, products) {
        this.id = id;
        this.orderDate = orderDate;

        this.customers = customers;
        this.products = products;
    }

    //Add
    add(callback) {
        const query = 'INSERT INTO '+tableName+' (orderDate) VALUES (?)';
        db.query(query, [this.orderDate], (err, results) => {
            if (err) {
                return callback(err);
            }
            this.id = results.insertId;
            callback(null, { id: this.id, orderDate: this.orderDate });
        });
    }

    addCustomer(callback, newCustomerId) {
        const query = 'INSERT INTO '+relationCustomer+' (Order_Id, Customer_Id) VALUES (?, ?)';
        db.query(query, [this.id, newCustomerId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.id, customer_id: newCustomerId });
        });
    }

    addProduct(callback, newProductId) {
        const query = 'INSERT INTO '+relationProduct+' (Order_Id, Product_Id) VALUES (?, ?)';
        db.query(query, [this.id, newProductId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.id, product_id: newProductId });
        });
    }

    //Get
    static get(id, callback) {
        const query = `
            SELECT 
                o.Id,
                o.OrderDate,
                oc.Customer_Id, 
                c.FirstName,
                c.LastName,
                c.Email, 
                op.Product_Id,
                p.Name
            FROM 
                `+tableName+` o
            LEFT JOIN 
                `+relationCustomer+` oc ON o.Id = oc.Order_Id
            LEFT JOIN 
                Customers c ON oc.Customer_Id = c.Id
            LEFT JOIN 
                `+relationProduct+` op ON o.Id = op.Order_Id
            LEFT JOIN 
                Products p ON op.Product_Id = p.Id
            WHERE o.id = ?
            `
        ;
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            if (results.length > 0) {
                
                //#region Mapping from database to js class
                const ordersMap = new Map();
                results.forEach(row => {
                    if (!ordersMap.has(row["Id"])) {
                        ordersMap.set(row["Id"], new Order(
                            row["Id"],
                            row["OrderDate"],
                            [],
                            []
                        ));
                    }
                    const order = ordersMap.get(row["Id"]);

                    if (!order.customers.some(customer => customer.id === row["Customer_Id"])) {
                        if (row["Customer_Id"] != null){
                            order.customers.push(new Customer(
                            row["Customer_Id"],
                            row["FirstName"],
                            row["LastName"],
                            row["Email"]
                            ));
                        }
                    }

                    if (!order.products.some(product => product.id === row["Product_Id"])) {
                        if (row["Product_Id"] != null){
                            order.products.push(new Product(
                                row["Product_Id"],
                                row["Name"]
                            ));  
                        }
                    }
                });

                const orderFinal = Array.from(ordersMap.values());
                //#endregion
                callback(null, orderFinal);
            } else {
                callback(null, null);
            }
        });
    }

    static getAll(callback, orderDate, productId) {
        let query = `
            SELECT 
                o.Id,
                o.OrderDate,
                oc.Customer_Id, 
                c.FirstName,
                c.LastName,
                c.Email, 
                op.Product_Id,
                p.Name
            FROM 
                `+tableName+` o
            LEFT JOIN 
                `+relationCustomer+` oc ON o.Id = oc.Order_Id
            LEFT JOIN 
                Customers c ON oc.Customer_Id = c.Id
            LEFT JOIN 
                `+relationProduct+` op ON o.Id = op.Order_Id
            LEFT JOIN 
                Products p ON op.Product_Id = p.Id
            WHERE 1=1
            `
        ;
        let queryParams = [];

        if (orderDate) {
            query += ' AND o.OrderDate = ?';
            queryParams.push(orderDate);
        }

        if (productId) {
            query += ' AND op.Product_Id = ?';
            queryParams.push(productId);
        }

        db.query(query, queryParams, (err, results) => {
            if (err) {
                return callback(err);
            }

            //#region Mapping from database to js class
            const ordersMap = new Map();
            results.forEach(row => {
                if (!ordersMap.has(row["Id"])) {
                    ordersMap.set(row["Id"], new Order(
                        row["Id"],
                        row["OrderDate"],
                        [],
                        []
                    ));
                }
                const order = ordersMap.get(row["Id"]);

                if (!order.customers.some(customer => customer.id === row["Customer_Id"])) {
                    if (row["Customer_Id"] != null){
                        order.customers.push(new Customer(
                            row["Customer_Id"],
                            row["FirstName"],
                            row["LastName"],
                            row["Email"]
                        ));  
                    }
                }

                if (!order.products.some(product => product.id === row["Product_Id"])) {
                    if(row["Product_Id"] != null){
                        order.products.push(new Product(
                            row["Product_Id"],
                            row["Name"]
                        )); 
                    }
                }
            });

            const orders = Array.from(ordersMap.values());
            //#endregion
            callback(null, orders);
        });
    }

    //Update
    update(callback) {
        const query = 'UPDATE '+tableName+' SET orderDate = ? WHERE id = ?';
        db.query(query, [this.orderDate, this.id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.id, orderDate: this.orderDate });
        });
    }

    updateCustomer(callback, newCustomerId, oldCustomerId) {
        const query = 'UPDATE '+relationCustomer+' SET Customer_Id = ? WHERE Order_Id = ? AND Customer_Id = ?';
        db.query(query, [newCustomerId, this.id, oldCustomerId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.id, oldCustomer_id: oldCustomerId, newCustomerId: newCustomerId });
        });
    }

    updateProduct(callback, newProductId, oldProductId) {
        const query = 'UPDATE '+relationProduct+' SET Product_Id = ? WHERE Order_Id = ? AND Product_Id = ?';
        db.query(query, [newProductId, this.id, oldProductId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.id, oldProduct_id: oldProductId, newProductId: newProductId });
        });
    }

    //Delete
    delete(callback) {
        const query = 'DELETE FROM '+tableName+' WHERE id = ?';
        db.query(query, [this.id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.affectedRows > 0);
        });
    }

    deleteCustomer(callback, customerId) {
        const query = 'DELETE FROM '+relationCustomer+' WHERE Order_Id = ? AND Customer_Id = ?';
        db.query(query, [this.id, customerId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.affectedRows > 0);
        });
    }

    deleteProduct(callback, productId) {
        const query = 'DELETE FROM '+relationProduct+' WHERE Order_Id = ? AND Product_Id = ?';
        db.query(query, [this.id, productId], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results.affectedRows > 0);
        });
    }

    static async deleteAll(){
        const query = 'DELETE FROM '+tableName;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error deleting '+tableName+':', err);
                return;
            }
        });
    }

    static async restoreSamples(){
        const query = "INSERT INTO "+tableName+" (orderDate) VALUES ('2022/07/24'), ('2023/04/23'), ('2024/02/22'), ('2025/01/24')";

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error restoring '+tableName+':', err);
                return;
            }
        });
    }

}

module.exports = Order;