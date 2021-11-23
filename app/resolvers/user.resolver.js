const Apolloerror = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const userModel = require('../models/user.model');
const codeModel = require('../models/resetcode.model');
const joiValidation = require('../../utilities/validation');
const bcryptPassword = require('../../utilities/bcrypt.hash');
const jwt = require('../../utilities/jwt.token');

const resolvers = {
    Query : {

        getAllUsers : async () => await userModel.find()
    },

    Mutation: {
        registerUser : async (_, { path }) => {
            const usermodel = new userModel({
                firstName: path.firstName,
                lastName: path.lastName,
                email: path.email,
                password: path.password,
            });

            const Validation = joiValidation.authRegister.validate(usermodel._doc);
            if (Validation.error) {
                return new Apolloerror.ValidationError(Validation.error);
            }

            const existingUser = await userModel.findOne({ email: path.email });
            if (existingUser) {
                return new Apolloerror.UserInputError("Email already exists");
            }

            bcryptPassword.hashpassword(path.password, (error, data) => {
                if (data) {
                  usermodel.password = data;
                } else {
                  throw error;
                }
                usermodel.save();
            });
            return usermodel;
        },

        loginUser : async (_, { path }) => {
            const loginmodel = {
                email : path.email,
                password : path.password
            };

            const Validation = joiValidation.authLogin.validate(loginmodel);
            if (Validation.error) {
                return new Apolloerror.ValidationError(Validation.error);
            }

            const userPresent = await userModel.findOne({ email: path.email });
            if (!userPresent) {
                return new Apolloerror.AuthenticationError("Email id is not registered");
            }

            const isMatch = await bcrypt.compare(path.password, userPresent.password);
            if (!isMatch) {
                return new Apolloerror.AuthenticationError("Incorrect Password");
            }

            const token = jwt.getToken(userPresent);

            return {
                id: userPresent.id,
                firstName: userPresent.firstName,
                lastName: userPresent.lastName,
                email: userPresent.email,
                token
            }
        },

        forgotPassword : async (_, { path }) => {
            const userPresent = await userModel.findOne({ email : path.email });
            if (!userPresent) {
                return new Apolloerror.AuthenticationError("Email id is not registered");
            }
            const resetcode = Math.random().toString(36).substring(2,12);
            const code = new codeModel({ email : path.email,resetcode });
            await code.save();

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
                to: path.email,
                subject: "Your Password Reset Code",
                text: resetcode
            })

            return {
                email: path.email,
                message: "Reset Code Sent to Registered email Successfully"
            }
        }
    }
};

module.exports = resolvers;
