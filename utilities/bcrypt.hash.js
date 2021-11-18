const bcrypt = require('bcryptjs');
class bcryptPassword {
    
    hashpassword = (details, callback) => {
        try{
        bcrypt.hash(details, 10, function (err, hash) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, hash);
            }
        })
    }
    catch (error) {
        return callback(error,null)
    }
}
}
module.exports = new bcryptPassword()