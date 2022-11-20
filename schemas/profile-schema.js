const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const ProfileSchema = mongoose.Schema({
    _id: reqString,
    FlightsAttended: reqNum,
    Balance: reqNum,
    Snapshots: reqString,
    Activity: reqString,
})

module.exports = mongoose.model('profile', ProfileSchema)
