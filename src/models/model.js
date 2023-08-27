const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({

    fileName :String,
    url:String

}, { timestamps: true })

module.exports = mongoose.model("url", urlSchema)