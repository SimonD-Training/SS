const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

let database = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});

database.connect((err) => {
    if (err) throw err;
    else console.log("Successful connection to Database.");
})

module.exports = database;