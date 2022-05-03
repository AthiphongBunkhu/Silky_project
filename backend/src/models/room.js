const mongoose = require('mongoose');

const collection = 'room';

const roomSchema = mongoose.Schema({
    roomNo: {
        type: String,
        require: true 
    },
    price: {
        type: Number,
        require: true
    },
    roomType:{
        type: String,
        require: true
    },
    roomStatus:{
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection
})

module.exports = mongoose.model(collection, roomSchema)