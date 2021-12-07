const Apolloerror = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const codeModel = require('../models/resetcode.model');
const joiValidation = require('../../utilities/validation');
const bcryptPassword = require('../../utilities/bcrypt.hash');
const jwt = require('../../utilities/jwt.token');
const nodeMailer = require('../../utilities/nodeMailer');

const userresolver = {
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
            const codePresent = await codeModel.findOne({ email: path.email });
            if (codePresent) {
                return { message: "Reset code is already sent to registered email. Please check Spam or Try after 60 seconds.. " };
            }
            nodeMailer.sendEmail(userPresent.email);
            return {
                email: path.email,
                message: "Reset Code Sent to Registered email Successfully"
            }
        },

        resetPassword : async (_, { path }) => {
            const resetPassword = {
                email: path.email,
                newPassword: path.newPassword,
                resetcode: path.resetcode
            };

            const Validation = joiValidation.authResetPassword.validate(resetPassword);
            if (Validation.error) {
                return new Apolloerror.ValidationError(Validation.error);
            }

            const userPresent = await userModel.findOne({ email: path.email });
            if (!userPresent) {
                return new Apolloerror.UserInputError(" You are Not Registered. Please Register User");
            }
            const checkcode = await codeModel.findOne({
                email: path.email,
                resetcode: path.resetcode
            });
            if (!checkcode) {
                return new Apolloerror.UserInputError("Invalid reset code or reset code expired. Please continue again with forgot Password");
            }

            bcryptPassword.hashpassword(path.newPassword, (error, data) => {
                if (data) {
                  userPresent.password = data;
                } else {
                  throw error;
                }
                userPresent.save();
            });
            return {
                id: userPresent.id,
                firstName: userPresent.firstName,
                lastName: userPresent.lastName,
                email: userPresent.email,
            };
        },
    }
};

module.exports = userresolver;
