const mongoose = require('mongoose');

const labelSchema = mongoose.Schema({
    labelName: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('labels', labelSchema);
