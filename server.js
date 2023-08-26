

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors')

const PORT = process.env.PORT || 3000 ; 

const connectDB = require('./config/db');
app.options('https://harmonious-clafoutis-bb2680.netlify.app/', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.send();
});
const corsOptions ={
    origin: process.env.ALLOWED_CLIENTS.split(',')

}

app.use(cors(corsOptions));

app.use(express.static('public'));
app.use(express.json());
connectDB();  

app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'ejs');


//Routes
app.use('/api/files' , require('./routes/files'));
app.use('/files' , require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, console.log(`Listening on port ${PORT}.`));
