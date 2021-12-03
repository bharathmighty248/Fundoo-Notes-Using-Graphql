const mongoose = require('mongoose');

const labelSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    noteId: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'note'
        }]
    },

    labelName: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('label', labelSchema);
