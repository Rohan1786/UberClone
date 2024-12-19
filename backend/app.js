const express=require('express');
const dotenv = require('dotenv');
dotenv.config();
const app=express();
const cors=require('cors');
const userRoutes=require('./routes/user_routes');
const functionToconnect = require('./db/db');
const cookieParser=require('cookie-parser')
functionToconnect()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/users',userRoutes)
app.use(cookieParser())

app.get("/",(req,res)=>{
res.send("Hello world");
})
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports=app;