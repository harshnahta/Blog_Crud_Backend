var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',

});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE BLOG", function (err, result) {
        if (err) {
            console.log(err.sqlMessage);
            process.exit(0);
        }else{
            console.log("Database created");
            process.exit(0);
        }

    });
});

