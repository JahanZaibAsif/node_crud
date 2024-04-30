require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
var multer = require('multer');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('upload'));
mongoose.connect('mongodb://localhost:27017/crud_node');
const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
const stripe = require('stripe')(STRIPE_SECRET_KEY);

const storage = multer.diskStorage({

    destination:function (req ,file ,cb) {
        cb(null, "./upload/product")
    },
    filename:function(req ,file ,cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }

});

const upload = multer({ storage: storage });

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    detail:{
        type:String,
        required:true
    },
    filename:{
        type:String,
        required:true
    }, price:{
        type:Number,
        required:true
    }
});

const product = mongoose.model('product',productSchema);


app.get('/', async(req , res) => {
   let data = await product.find();
    res.render("product", {data});
});

app.get('/add_product', (req , res) => {
    res.render("create_product");
});

app.post('/store_product', upload.single('image') , async(req , res) => {
    const {name,detail,price} = req.body;
    const {filename} = req.file;
    const newProduct = new product({name,detail,price,filename});
    await newProduct.save();
     res.redirect('/');
});

app.get('/buy_now/:id' , async(req , res) => {
    const newProduct = await product.findById(req.params.id);
    const productPrice = newProduct.price;
    const productName = newProduct.name;



    const StripePrice = await stripe.prices.create({
        currency: 'usd',
        unit_amount: productPrice*100,
        product_data: {
          name: productName,
        },
      });



    const checkout = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: StripePrice.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://yourwebsite.com/success', // Replace with your success URL
        cancel_url: 'https://yourwebsite.com/cancel',   // Replace with your cancel URL
      });
      const checkoutUrl = checkout.url
      console.log('price:', checkout.url);
     res.redirect(checkoutUrl);

});


app.listen(5000, () => {
    console.log(`Server started on 5000`);
});