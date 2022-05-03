const mongoose = require('mongoose');

const collection = 'user';

const userSchema = mongoose.Schema({
    username: {type: String, require: true},
    firstname:{type: String, require: true},
    lastname: {type: String, require: true},
    password: {type: String, require: true},
    email:    {type: String, require: true},
}, {
    timestamps: true,
    versionKey: false,
    collection
});

module.exports = mongoose.model(collection, userSchema);