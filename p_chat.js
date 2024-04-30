const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const ejs = require('ejs')
 app.set('view engine', 'ejs');
const io = socketIO(server);
app.use(express.static('upload'));

const path = require('path');

// ------------- file upload ------------------------
const storage = multer.diskStorage({
  destination : function (req ,file ,cb){
       cb(null, "./upload/register");
  },
  filename : function (req ,file ,cb) { 
       cb(null, `${Date.now()}-${file.originalname}`);
  }
});

var upload = multer({ storage: storage });
const bodyParser = require('body-parser');
// ------------- End File Upload --------------------

// Connect to MongoDB
mongoose.connect('mongodb://localhost/chat');
const registerSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email:{ type: String, unique: true, required: true },
  filename:{type: String}
  
});
const userRegister = mongoose.model('userRegister', registerSchema);



app.get('/', (req , res) => {
 
  res.render("p_chat");
});

app.get('/show_user', async(req , res) => {
  const data = await userRegister.find();
  res.render('all_chat',{data});
});

app.post('/register' , upload.single('picture') , async(req , res) =>{
  const {name,email,password} = req.body;
  const{filename} = req.file;
  const newRegister = new userRegister({name,email,password,filename});
await newRegister.save();
 res.redirect('/show_user');
});


app.get('/show_data/:id', async(req , res) => {
  const data = await userRegister.find();
  const show = await userRegister.findById(req.params.id);
   res.render("next_chat" ,{show,data});
});

io.on("connection" , (socket) => {
  socket.on("user-message" , (message) => {
    console.log(message);
   io.emit("message",message,socket.id );
   console.log(`Message from ${socket.id}: ${message}`);

  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
