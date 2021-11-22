const bcrypt = require('bcryptjs');

class bcryptPassword {
    // eslint-disable-next-line class-methods-use-this
    hashpassword = (details, callback) => {
        try {
            bcrypt.hash(details, 10, (err, hash) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, hash);
            })
        } catch (error) {
            return callback(error,null)
        }
}
}
module.exports = new bcryptPassword()
