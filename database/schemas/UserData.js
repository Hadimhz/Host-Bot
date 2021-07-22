const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({

    userID: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
    // Add more which are needed
})