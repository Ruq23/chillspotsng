const mongoose = require('mongoose')


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log('Connected to MongoDb succesfully')
    }catch(e) {
        console.log('Connection failed' + error.message)
    }
}

module.exports = connectDB