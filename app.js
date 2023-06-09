const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const errorHandler = require('./helpers/error-handler');




app.use(cors());
// app.options('*', cors())
app.use(express.urlencoded({ extended: true }))

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));


//Routes
// const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

// app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database',
    useFindAndModify: false
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})


app.use(errorHandler);
const port = process.env.PORT || 2000;

//Server
// app.listen(port, "0.0.0.0", ()=>{

//     console.log('server is running http://localhost:3000');
// })
app.listen(port, ()=>{

    console.log('server is running http://localhost:3000');
})