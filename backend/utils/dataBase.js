const mongoose = require('mongoose')


const DB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL) 
        console.log("Database connection successfully");
    } catch (error) {
        console.log("Database problem");
    }
}


module.exports=DB