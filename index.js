const express = require('express')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = 3030

app.use(cors())
app.use(bodyParser.json())
app.listen(port, serverStart)

//-----------------
var db = {}

function serverStart(){
    console.log("Listening...")
}

app.get('/viewer', (req, res) => {
    console.log("hello")
    res.send({result: "hi"})
})

app.post('/mint', (req, res) => {
    db = {...db, ...req.body}
    console.log(req.body)
})