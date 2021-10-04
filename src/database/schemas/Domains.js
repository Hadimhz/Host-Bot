const mongoose = require('mongoose');

const DomainsSchema = new mongoose.Schema({

    // User's discord ID
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true
    },

    // Domain
    domain: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("Domains", DomainsSchema);