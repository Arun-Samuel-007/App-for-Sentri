const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, trim: true, required: true},
    password: { type: String, required: true},
    createdOn: { type: Date, default: new Date()}
});

module.exports = new mongoose.model('User',userSchema);
