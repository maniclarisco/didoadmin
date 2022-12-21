const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let admin = new Schema({
   name: {
        type: String
    },
    email: {
        type: String,index:true 
    },
    pwd_exp_time:{
        type: Date
    },
    pat_exp_time:{
        type: Date
    },
    password: {
        type: String 
    },
    lock_pat: {
        type: String 
    },
    phone_number:{
        type: String 
    },
    status:{
        type: String
    },
    profile_image: {
        type: String, default: "default.png", 
    }, 
    created_date:{
        type:Date,default: Date.now
    }
}); 

module.exports = mongoose.model('admin', admin, 'admin')