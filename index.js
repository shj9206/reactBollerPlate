const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.createConnection('mongodb+srv://Hwajun:1q2w3e4r@cluster0.6rwuh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {useNewUrlParser: true})
        .then(()=>console.log('DB connected'))
        .catch(err => console.error(err));




app.get('/',(req,res)=>{
    res.send('hello world')
});



app.listen(5000);