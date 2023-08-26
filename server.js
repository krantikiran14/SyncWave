

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors')

const PORT = process.env.PORT || 3000 ; 

const connectDB = require('./config/db');
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://harmonious-clafoutis-bb2680.netlify.app/'); // You can replace '*' with your specific domain
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
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
