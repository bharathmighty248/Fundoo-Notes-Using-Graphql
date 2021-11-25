const nodemailer = require('nodemailer');
const codeModel = require('../app/models/resetcode.model');

class forgotReset {
    // eslint-disable-next-line class-methods-use-this
    sendEmail = (details, callback) => {
        try {
            const resetcode = Math.random().toString(36).substring(2,12);
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL_SENDER,
                    pass: process.env.PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            transporter.sendMail({
                from: process.env.MAIL_SENDER,
                to: details,
                subject: "Your Password Reset Code",
                text: resetcode
            })

            const code = new codeModel({ email : details,resetcode });
            code.save();
            return true;
        } catch (error) {
            return callback(error,null);
        }
    }
}

module.exports = new forgotReset();
