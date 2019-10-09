const express = require('express');
const path    = require('path');
const multer  = require('multer');
const uuid    = require('uuid/v4');

const app  = express();
const dest = path.join(__dirname, 'public/uploads');

//****************************************************************************
//  SETTINGS
//****************************************************************************
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//****************************************************************************
//  MIDDLEWARES
//****************************************************************************
const storage = multer.diskStorage({
  destination: dest,
  filename: (req, file, callback) => {
    callback(null, uuid() + path.extname(file.originalname).toLocaleLowerCase());
  }
});

app.use(multer({
  storage,
  dest,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, callback) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype  = fileTypes.test(file.mimetype);
    const extName   = fileTypes.test(path.extname(file.originalname));

    if (mimetype && extName) {
      return callback(null, true);
    }

    callback('Error: El archivo debe de ser una imagen valida');
  }
}).single('image'));

//****************************************************************************
//  ROUTES
//****************************************************************************
app.use(require('./routes/index.routes'));

//****************************************************************************
//  STATIC FILES
//****************************************************************************
app.use(express.static(path.join(__dirname, 'public')));

//****************************************************************************
//  LISTENER
//****************************************************************************
app.listen(app.get('port'), () => console.log(`Server on port ${app.get('port')}`));