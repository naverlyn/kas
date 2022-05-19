const express = require('express')
const app = express()
const mysql = require('mysql')
const { render } = require('express/lib/response');
const Connection = require('mysql/lib/Connection');
const { CLIENT_MULTI_RESULTS } = require('mysql/lib/protocol/constants/client');
const { request } = require('express');
const { query } = require('express');
app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))

// koneksi database
let con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "kas"
    }
)
con.connect(function(err) {
    if (err) {
        return console.error("Error, couldn't connect to server: " + err.message);
    }
    console.log("connected to database")
})


//main function
app.get('/', (req, res) => {
    res.render('index.ejs')
})

//redirect ke landing
app.get('/landing', (req, res) => {
    res.render('landing.ejs')
})

//insert query di landing ke db
app.post('/landing', (req, res) => {
    getUsername = req.body.username
    getPassword = req.body.password
    if (getUsername && getPassword) {
        con.query("SELECT * FROM login WHERE username=? AND password=?", [getUsername, getPassword], function(error, results, fields){
            if (error) throw error;
            //kalo ada akun
            if (results.length > 0)
            {
                res.render('landing.ejs', {getUsername})
            }
            else{
                res.send("Username atau Password salah")
            }
            res.end()
        })
    }else
    {
        res.send("Username atau Password salah")
    }
})

//insert query ke tabel data_setor
app.post('/isi', (req, res) => {
    let nomor = req.body.Nomor;
    let karyawan = req.body.staff;
    let money = req.body.money;
    let tgl_terima = req.body.tgl_terima;
    let ket = req.body.ket;
    let laporan = `INSERT INTO laporan values("${nomor}", "${nomor}", "${karyawan}", "${money}", "${tgl_terima}", "${tgl_terima}", "${ket}");`
    let sql = `
    INSERT INTO data_setor values("${nomor}", "${karyawan}", "${money}", "${tgl_terima}", "${ket}");`
    con.query(sql, function(error, results)
    {
        if (error) throw error;
        res.redirect('/isi.ejs')
    })
    con.query(laporan, function(error, results)
    {
        if(error) throw error;
    })
    res.render('isi.ejs')
})

app.get('/isi', (req, res) =>{
    console.log(req.body)
    res.render('isi.ejs')
})

app.post('/laporan', (req, res) => {
    res.render('laporan.ejs')
})

app.get('/laporan', (req, res) =>{
    let sql = `SELECT * FROM laporan`
    con.query(sql, function(error, results)
    {
        if(error)
        {
            throw error
        }
        else
        {  
              res.render('laporan.ejs', {
                  row: results
              })

            //  console.log(tableData)
        }
    })

})

app.listen(3000)