const mongoose = require('mongoose');

const reqString = {
    type: mongoose.SchemaTypes.String,
    required: true
}

const UserPremSchema = new mongoose.Schema({
    // User's discord ID
    userID: reqString,

    // The amount of servers the user can make
    amount: reqString,

    // The amount they have used
    used: reqString,
})
    module.exports = mongoose.model('UserPrem', UserPremSchema);