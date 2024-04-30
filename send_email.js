const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const http = require('http');
const server = http.createServer(app);
// Create a transporter using SMTP or other transport mechanisms
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jahanzaibasif969@gmail.com',
    pass: 'your-generated-app-password'
  }
});

// Define the email options
const mailOptions = {
  from: 'zaib3550274@gmail.com',
  to: 'tayyabrajpoot122@gmail.com',
  subject: 'Usman Akram',
  text: 'how are you'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Error:', error);
  }
  console.log('Email sent:', info.response);
});


server.listen(5000, () => {
  console.log(`Server is running on 5000`);
});