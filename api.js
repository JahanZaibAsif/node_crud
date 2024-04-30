 const express = require('express'); 

 const app = express();

 const dbConnect = require('./mongoDb');

 const ejs = require('ejs')

 app.set('view engine', 'ejs');


 app.get('/', async (req , res) => {
    let data = await dbConnect();
    let dataObj = await data.find().toArray();
    res.render('home', {dataObj });
 });

 


 app.listen(3000, () => {
    console.log('App listening on port 3000!');
 });