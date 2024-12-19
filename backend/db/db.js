const mongoose=require('mongoose');

const functionToconnect=()=>{
    mongoose.connect(process.env.DB_CONNECT)
.then(() => {
    console.log('Connected to MongoDB!');
})
.catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});}

module.exports=functionToconnect;