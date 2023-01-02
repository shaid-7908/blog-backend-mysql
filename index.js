const express = require('express')
const connection = require('./connection.js');
const bodyParser=require('body-parser')
const routes = require('./routes')
const fileuPload=require('express-fileupload') 


connection();
const app =express()

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileuPload({
    useTempFiles:true
}))

app.use('/api',routes)



app.listen(8000,()=>{
    console.log('Connected')
})