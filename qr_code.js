const qr = require('qrcode');
const fs = require('fs');

// Data to encode in the QR code
const data = 'Hello, this is a QR code!';

// Options for the QR code
const options = {
  type: 'png',
  quality: 0.3,
  margin: 1,
  color: {
    dark: '#000',  // Color of the dark modules
    light: '#FFF'  // Color of the light modules
  }
};

// Generate QR code
qr.toFile('qrcode.png', data, options, (err) => {
  if (err) throw err;
  console.log('QR code generated!');
});
