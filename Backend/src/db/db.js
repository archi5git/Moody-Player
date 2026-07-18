const mongoose = require("mongoose")
const dns=require("dns");
const { error } = require("console");
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

function connectDb(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("connected to db");
        
    })
    .catch  ((err)=>{
        console.error("Error in connecting to MongoDb:",err);
    })
}


module.exports = connectDb                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               