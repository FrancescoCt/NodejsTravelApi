﻿<h1 align="center">NodejsTravelApi</h1>
<p align="center">
  <i>Un servizio API in PHP per una agenzia di viaggio</i>
  <br/><br/>
  <img width="400" alt="Xampp" src="https://github.com/FrancescoCt/francescoct.github.io/blob/master/assets/img/lavagna.jpg"/>
  <br/><br/>
  <b><a href="#features">Features</a></b> | <b><a href="#getting-started">How it works</a></b> | <b><a href="https://francescoct.github.io/">About me</a></b>
  <br/><br/>
  <a href="https://github.com/FrancescoCt/NodejsTravelApi/blob/main/CHANGELOG.md"><img src="https://img.shields.io/badge/version-0.1-blue" alt="Current Version"/></a>
  <a target="_blank" href="https://github.com/FrancescoCt/NodejsTravelApi"><img src="https://img.shields.io/github/last-commit/francescoct/NodejsTravelApi?logo=github&color=609966&logoColor=fff" alt="Last commit"/></a>
</p>
<div align="center">
  <img src="https://github.com/FrancescoCt/NodejsTravelApi/blob/master/Thumbnail.png" alt="Thumbnail" width="100%"/>
</div>
<br/><br/>

<details>
  <summary><b>Table of Contents</b></summary>

* [Features](#-features)
* [How it works](#-how-it-works)
* [How to test it](#-how-to-test-it)
</details>

<h2 id="features">🎯 Features</h2> 

* 🔍 **API REST**. Custom API which use Rest standard.
* 📱**Helper**. If you don't know where to start, have a look at the index.html of the helper.
* 📅**Database**. Manipulate data in a SQL database and perform API calls.
* 💻 **Languages**. NodeJS, MySQL, HTML, CSS, Javascript (helper) <br/>
  <img width="24" height="24" alt="SQL" src="https://github.com/FrancescoCt/francescoct.github.io/blob/master/assets/favicons/mysql.png"/><img width="24" height="24" alt="Html" src="https://github.com/FrancescoCt/francescoct.github.io/blob/master/assets/favicons/html.png"/><img width="24" height="24" alt="Css" src="https://github.com/FrancescoCt/francescoct.github.io/blob/master/assets/favicons/css.png"/><img width="24" height="24" alt="Javascript" src="https://github.com/FrancescoCt/francescoct.github.io/blob/master/assets/favicons/javascript.png"/>

<h2 id="getting-started">🔍 How it works</h2>
<p>There's a global helper that gives the list of the CRUD methods that are implemented. The APIs support the Creation, Read, Update, Delete of tables Products, Customer and Orders and their intersection. <br>
  If you don't want to use POSTMAN, you can use directly the forms, have a look at the views. <br>
  All operations are performed on a local SQL DB (you have to create one first) with , you can call it for example NodeJsTravelAPI. The structure of the database is reported in the file migrations.sql. You should create a normal .env file <br>
  Once the DB is set you should be able to access it with a server like Apache and perform the calls via Forms or via Postman. <br>
  If you want to use XAMPP like I did, take this Repository and copy paste it in the htdocs repository of Xampp resources explorer, it will work just fine.
  When you download the repository, make sure to create the database, the .env file with your credentials, load all the modules in package.json with npm install, then start the server with node app.js.
  For further explanation have a look at note.txt file, the requirements of the project are located in requisiti.txt file.

</p>

## 💻 How to test it

* Download xampp with default settings, then download the current repository and put it in htdocs repository. Then test it on localhost. Here is the [link to Xampp](https://www.apachefriends.org/it/index.html).
* Run the automated test with line npx mocha tests/, just make sure the server app.js is not running in background
