const mongoose = require('mongoose');

const reqString = {
    type: mongoose.SchemaTypes.String,
    required: true
}

const UserDataSchema = new mongoose.Schema({
    // User's discord ID
    userID: reqString,
    
    // User's console ID
    consoleID: reqString,

    // User's console email
    email: reqString,

    // User's console username
    username: reqString,

    // Timestamp when the account was created
    createdTimestamp: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
})

module.exports = mongoose.model('UserData', UserDataSchema);