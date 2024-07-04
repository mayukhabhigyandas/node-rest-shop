const express=require('express');
const app= express();
const morgan=require('morgan');
const bodyParser = require('body-parser');
const connectToMongo = require('./db');

connectToMongo();

const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');
const userRoutes=require('./api/routes/user');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({exetended:false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-with, Content-Type, Accept, Authorization");
    if(req.method==='Options'){
        res.header('Access-Control-Allow-Headers', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next)=>{
    const error = new Error('Note found');
    error.status=404;
    next(error);
})

app.use((error, req,res, next)=>{
    res.status=error.status||500;
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports=app;