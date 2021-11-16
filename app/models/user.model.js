const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
},
    {
        timestamps: true
    });

    UserSchema.pre("save", async function(next) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    })

module.exports = mongoose.model('userModel', UserSchema)