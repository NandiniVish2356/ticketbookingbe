const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'trsdb' ,
  port:3306,
  insecureAuth:true
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected!');
});
module.exports = db