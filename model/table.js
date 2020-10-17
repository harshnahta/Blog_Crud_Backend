var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: "BLOG"

});
// status =1 (true)  status=0 (false)
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(25),email VARCHAR(100) UNIQUE,mobile varchar(10),token varchar(255),password varchar(255),images text,tag text,status boolean)";
    con.query(sql, function (err, result) {
        if (err){
            console.log(err.sqlMessage);
            
        }else {
            console.log("Table users created");
           
        }
    });

    var sql = "CREATE TABLE post (id INT AUTO_INCREMENT PRIMARY KEY,user_id INTEGER(10),title VARCHAR(100),content text,images text,status varchar(7),create_date DATE,update_date DATE)";
    con.query(sql, function (err, result) {
        if (err){
            console.log(err.sqlMessage);
            
        }else {
            console.log("Table post created");
        
        }
    });

    var sql = "CREATE TABLE comment (id INT AUTO_INCREMENT PRIMARY KEY,user_id INTEGER(10),post_id INTEGER(10),content text,status varchar(7),create_time DATE,update_time DATE)";
    con.query(sql, function (err, result) {
        if (err){
            console.log(err.sqlMessage);
            process.exit(0);
        }else {
            console.log("Table comment created");
           process.exit(0);
        }
    });

    
    



});

