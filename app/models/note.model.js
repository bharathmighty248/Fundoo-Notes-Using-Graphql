const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
    {
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: String
    }
},
    {
        timestamps: true,
    },
    );

module.exports = mongoose.model('notes', NoteSchema);
