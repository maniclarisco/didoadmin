const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let user = new Schema({
    email: {
        type: String,index:true 
    },
    password: {
        type: String 
    },
    phone_number:{
        type: String 
    },
    status:{
        type: String
    },
    created_date:{
        type:Date,default: Date.now
    }
}); 

module.exports = mongoose.model('user', user, 'user')