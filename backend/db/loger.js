const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    pass: { type: String, required: true }
})
module.exports = mongoose.model('log', logSchema);