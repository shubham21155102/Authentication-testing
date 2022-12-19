//MongoDB connection config.js / db.js
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose
.connect(process.env.DATABASE,{
 useNewUrlParser: true,
// useUnifiedToplogy:true,
// useCreateIndex:true
})
.then(() => {
console.log('connected to db');
 })
.catch((err) => {
console.log(err.message);
 });