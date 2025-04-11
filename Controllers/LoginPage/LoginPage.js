const { request, response } = require('express');
const db = require('../../db');

const insertuserdetail = (req, res) => {
    const { username, password } = req.body;
    let query = `insert into userdetail(username,upassword) values("${username}","${password}")`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
            res.send({ msg: "Create Unique Password !" })
        } else if (data.affectedRows > 0) {
            res.send({ msg: "SignUp Successfully" })
        }
    })

}
const checkuserdetail = (req, res) => {
    let query = `select username,upassword,uid from userdetail where username='${req.params.username}'and upassword='${req.params.password}'`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            console.log(data[0].uid);
            
            res.send({ data: data,found:true ,uid:data[0].uid})
        }else{
            res.send({ found:false})
        }
    })
}
const getuserdetail = (req, res) => {
    let query = `select * from userdetail`
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            res.send({ data });
        }
    })
}

module.exports = { insertuserdetail, checkuserdetail,getuserdetail }