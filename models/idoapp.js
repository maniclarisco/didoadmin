const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let idoapp = new Schema({
    adminid:{
        type:Schema.Types.ObjectId
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    projectname:{
        type:String
    },
    description:{
        type:String
    },
    teams:{
        type:String
    },
    investors:{
        type:String
    },
    smartaudit:{
        type:String
    },
    whitepaperlink:{
        type:String
    },
    websitelink:{
        type:String
    },
    githublink:{
        type:String
    },
    telegramgroup:{
        type:String
    },
    telegramlink:{
        type:String
    },
    tokensupply:{
        type:String
    },
    initialsupply: {
        type:String
    },
    tokenprice:{
        type:String
    },
    hardcapvalue:{
        type:String
    },
    softcapvalue:{
        type:String
    },
    blockchainvalues:{
        type:String
    },
    contractaddress:{
        type:String
    },
    chains:{
        type:String
    },
    contractaddress:{
        type:String
    },
    startdate:{
        type:Date
    },
    enddate:{
        type:Date
    },
    status:{
        type:String
    },
    created_date:{
        type:Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model('idoapp', idoapp, 'idoapp')