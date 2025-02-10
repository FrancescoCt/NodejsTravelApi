--Dopo essere entrati come utente root applicare i comandi seguenti
--Creazione database
CREATE DATABASE IF NOT EXISTS nodejstravelapi;

--Creazione utente personalizzato (-u developer -p developer)
CREATE USER 'developer'@'%' IDENTIFIED BY 'developer';
-- se già esiste l'utente developer, procedere con l'assegnazione dei privilegi
GRANT ALL PRIVILEGES ON nodejstravelapi.* TO 'developer'@'%';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'developer'@'%';

--A questo punto uscire da mysql con i privilegi di amministratore e riloggarsi con la stringa:
--mysql -u developer -p

-- Creazione tabelle
CREATE TABLE IF NOT EXISTS Products (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) UNIQUE NOT NULL CHECK (Name <> '')
);

CREATE TABLE IF NOT EXISTS Customers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(20) NOT NULL CHECK (FirstName <> ''),
    LastName  VARCHAR(20) NOT NULL CHECK (LastName  <> ''),
    Email     VARCHAR(20) NOT NULL CHECK (Email  <> '')
);

CREATE TABLE IF NOT EXISTS Orders (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderDate DATE
);

-- Tabella di associazione per Orders e Customers
CREATE TABLE OrderCustomers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Order_Id INT,
    Customer_Id INT,
    UNIQUE (Order_Id, Customer_Id),
    FOREIGN KEY (Order_Id) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (Customer_Id) REFERENCES Customers(Id) ON DELETE CASCADE
);

-- Tabella di associazione per Orders e Products
CREATE TABLE OrderProducts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Order_Id INT,
    Product_Id INT,
    UNIQUE (Order_Id, Product_Id),
    FOREIGN KEY (Order_Id) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (Product_Id) REFERENCES Products(Id) ON DELETE CASCADE
);

-- Esempio di inserimento dati
INSERT INTO Products (name) VALUES ('Travel_to_Italy'), ('Travel_to_France'), ('Travel_to_Germany'), ('Travel_to_Spain'), ('Travel_to_Greece');
INSERT INTO Customers (FirstName, LastName, Email) VALUES ('John', 'Milton', 'john@gmail.com'), ('Margaret', 'Stuart', 'margaret@gmail.com'), ('Steve', 'Jobs', 'steve@gmail.com');
INSERT INTO Orders (orderDate) VALUES ('2022/07/24'), ('2023/04/23'), ('2024/02/22'), ('2025/01/24');

INSERT INTO OrderCustomers (Order_id, Customer_Id) VALUES (1, 3), (2, 1), (2, 2), (3, 3);
INSERT INTO OrderProducts (Order_id, Product_Id) VALUES (1, 3), (2, 1), (2, 2), (3, 3);

--Esempi di select
--Retrieve all data of given order
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
    Orders o
LEFT JOIN 
    OrderCustomers oc ON o.Id = oc.Order_Id
LEFT JOIN 
    Customers c ON oc.Customer_Id = c.Id
LEFT JOIN 
    OrderProducts op ON o.Id = op.Order_Id
LEFT JOIN 
    Products p ON op.Product_Id = p.Id
WHERE 
    p.name = 'Travel_to_France';

--Other parameters that can be inserted in where clause
--o.Id = 2;
--c.Id = 1

-- UPDATE OrderProducts SET Product_Id = 1 WHERE Order_Id = 2 AND Product_Id = 3
-- delete from orderCustomers where order_id = 5 and customer_id = 5;