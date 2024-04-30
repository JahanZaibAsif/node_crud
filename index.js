const express = require('express');

const fs = require('fs');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const path = require('path');

var multer = require('multer');
const { request } = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET || 'default_secret_key';
const session = require('express-session')
const app = express();
app.use(express.static('upload'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bcrypt = require('bcrypt');


app.use(
  session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
  })
);




// ---------------- upload file ------------------------
const storage = multer.diskStorage({
  destination : function (req ,file ,cb){
       cb(null, "./upload");
  },
  filename : function (req ,file ,cb) { 
       cb(null, `${Date.now()}-${file.originalname}`);
  }
});
var upload = multer({ storage: storage });

// ---------------- End upload file --------------------





mongoose.connect('mongodb://localhost:27017/crud_node');


// ------------ create Schema --------------------------
const studentSchema = new mongoose.Schema({

    name:String,
    filename:String,
    studentClass:String,
    phone:Number,
    age:Number
});

const registerSchema = new mongoose.Schema({
  f_name:{
    type:String,
    required:true
  },
  l_name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique: true
  },
  password: String
});


// ------------ End Schema ------------------------------



// ------------ Create Model ----------------------------

const student = mongoose.model('student',studentSchema);
const register = mongoose.model('register', registerSchema);

// ------------ End Model --------------------------------


// =============== Login and Register ===============================
app.get('/register' , (req , res) => {
  res.render("register");
});

app.post('/store_register' , async(req , res) => {
  const{f_name,l_name,email,password} = req.body;
  console.log('Received data:', { f_name, l_name, email, password });
  const newRegister = new register({ f_name, l_name, email, password });
  try {
    await newRegister.save();
    console.log('Data successfully saved');
     res.redirect('/login');
  } catch (error) {
    console.error('Error during save:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/' , (req , res) => {
  res.render("login");
});


const checkTokenExpiration = (req, res, next) => {
  const token = req.session.token;
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        delete req.session.token; 
        res.redirect('/');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/');
  }
};


app.post('/store_login', async (req, res) => {
  const { email, password } = req.body;
  const user = await register.findOne({ email, password });
  if (!user) {
    res.redirect('/');
  } else {
    const token = jwt.sign({ id: user._id, name: user.name }, secretKey, {
      expiresIn: '1m', // Token expiration time
    });
    req.session.token = token; // Set the token in a cookie
    
    res.redirect('/dashboard');
  }
  
});

// =============== End Login and Register ===========================







//================ All Route =============================

app.get('/dashboard',checkTokenExpiration, async(req,res) => {
  let dataObj = await student.find()
  res.render("student_record",{dataObj});
})

app.get('/add', checkTokenExpiration, async(req,res) => {
    res.render("student_form",);
})


// --------------- insert data -------------------------
app.post('/add', checkTokenExpiration, upload.single('picture'),  async (req, res) => {
    const { name, age, phone, studentClass   } = req.body;
    const { filename } = req.file; // Access the uploaded file using req.file
    console.log(filename);
    const newStudent = new student({ name, age, phone,  studentClass ,filename   });
    await newStudent.save();
    res.redirect('/dashboard');
});
// --------------- End insert data ---------------------



// --------------- Delete Data -------------------------
app.get('/delete/:id' , checkTokenExpiration, async(req , res) => {
  let dataObj = await student.findById(req.params.id);
  let imageName = dataObj.filename;
  fs.unlink(`upload/${imageName}` , (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File deleted successfully');
  });
  console.log(dataObj.filename);
    await student.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
});
// --------------- End Delete Date ---------------------


// --------------- Edit and update ---------------------
app.get('/edit/:id' ,checkTokenExpiration, async (req , res) => {
    let dataObj = await student.findById(req.params.id);
    res.render("edit" ,{dataObj});
});

app.post('/edit/:id' ,upload.single('picture'), async (req , res ) =>{
    const {name,age,phone,studentClass} = req.body;
    const filename = req.file ? req.file.filename : null;
 
    await student.findByIdAndUpdate(req.params.id, { name, age, phone,studentClass ,filename});
    res.redirect('/dashboard');
});

// --------------- End Edit and Update ------------------


// --------------- Search API ---------------------------

app.get('/search',checkTokenExpiration, async (req, res) => {
    try {
      const { name } = req.query;
      if (!name) {
        return res.send('Please enter a search term.');
      }
      const data = await student.find({
        "$or": [
          { "name": { $regex: new RegExp(name, 'i') } } // Case-insensitive search
        ]
      });
      res.render("result" ,{data});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
// -------------- End Search API ------------------------

// =============== End Route ===========================

app.listen(4000, () => {
    console.log(`Server started on port`);
});