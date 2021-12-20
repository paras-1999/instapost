const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    by: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    comments: { type: Array },
    date: { type: Date, default: Date.now }
})
module.exports = mongoose.model('post', postSchema);