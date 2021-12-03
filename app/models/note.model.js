const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
    {
    email: {
        type: String,
        required: true
    },
    labelId: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'label'
        }]
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},
    {
        timestamps: true,
    },
    );

module.exports = mongoose.model('notes', NoteSchema);
