var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: "BLOG"

});

db.connect(function(err) {
    if (err){
        console.log(err.message)
    }
    else {
       console.log("DB connected");

    }
});

module.exports=db;