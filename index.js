const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');
const BodyParse = require('body-parser');
const multer = require('multer');

const app = express();
app.use(cors())
app.use(express.json())
app.use(BodyParse.urlencoded({extended: true}))
app.use(multer().array())

dotenv.config({ path: './config.env' });

//creating SQL connection
const db = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD ,
    database: process.env.DATABASE
  });

//connect
db.connect((err)=>{
    if(err) {throw err}
    console.log('Mysql connected...')
});

//create DB
app.get('/createdb', (req, res)=>{
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result)=>{
     if(err) throw err;
     console.log(result)
     res.status(201).json({
         status:"Sccuess",
         message: "Database created..."
     })
    })
});

//create table
app.get('/createtable', (req, res)=>{
    let sql = 'CREATE TABLE Persons(id int AUTO_INCREMENT , first_name varchar(255), last_name varchar(255), gender varchar(255), status varchar(255), PRIMARY KEY (id))'
    db.query(sql, (err, result)=>{
        if(err) throw err
        console.log(result)
        res.status(201).json({
            status:'success',
            message: 'Table created'
        })

    })
});

//get all the data
app.get('/students', (req, res) => {
    const sql = 'select * from Persons';
    db.query(sql, (err, results) => {
    if(err){ throw  err}
    res.status(200).json({
        status:'SCCUESS',
        length: results.length,
        data:{
            results
        }
    })
   })  
 });

//create new data
app.post('/student', (req, res)=>{
    const details = req.body;
    const sql = `INSERT INTO Persons SET ?   `;
    db.query(sql, details, (err, result)=>{
     if(err) throw err;
     res.status(201).json({
         status:'sccuess',
         message:'Data has been Saved'
     })
    })
});

// update user by id
app.put('/student/:id', (req, res) => {
    const newDetails = req.body;
    const { id } = req.params;
    const sql = 'UPDATE Persons SET ? WHERE id = ?';
    db.query(sql,[newDetails, id],(err, row) => {
    if (err) throw err 
    res.status(201).json({
        status: 'success',
        message:'Record has been updated'
     })
    })
});

//find user
 app.get('/studentsdata', (req, res)=>{
     const {gender, status} = req.query;
     if(gender && status){
         var sql = 'SELECT * FROM Persons WHERE gender = ? AND status = ? ';
     } else{
        var sql = 'SELECT * FROM Persons WHERE gender = ? OR status = ? ';
     } 
     db.query(sql, [gender,status], (err, results)=>{
         if (err) throw err
         res.status(200).json({
             status: 'success',
             length: results.length,
             data:{
                 results
             }
         })
     })
 });
 
 //delete user
 app.delete('/deleteuser/:id', (req, res)=>{
     const { id } = req.params;
     const sql = 'DELETE FROM Persons WHERE id=?';
     db.query(sql,[id], (err, result)=>{
         if(err) throw err;
         res.status(200).json({
             status:'success',
             message:'Data has been removed'
         })
     })
 });

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`App is running on ${PORT}`)
});