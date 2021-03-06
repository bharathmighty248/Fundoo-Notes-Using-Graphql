const mongoose = require('mongoose');
const logger = require('./logger');

exports.dbConnection = () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
    }).then(() => {
        logger.info('Successfully connected to the database');
    }).catch((err) => {
        logger.info('Could not connect to the database. Exiting now...', err);
        process.exit();
    })
};
