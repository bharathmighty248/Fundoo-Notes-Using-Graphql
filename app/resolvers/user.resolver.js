const Apolloerror = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const codeModel = require('../models/resetcode.model');
const joiValidation = require('../../utilities/validation');
const bcryptPassword = require('../../utilities/bcrypt.hash');
const jwt = require('../../utilities/jwt.token');
const nodeMailer = require('../../utilities/nodeMailer');
const noteModel = require('../models/note.model');
const labelModel = require('../models/label.model');

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

        addLabelandNotes: async (_,{ path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                // checking user labels
                const userLabels = await labelModel.find({ userId: context.id });
                if (userLabels.length === 0) {
                    return new Apolloerror.UserInputError('user has not created any Labels yet..First create Label')
                }
                if (userLabels.length !== 0) {
                    const checkLabel = userLabels.filter((Element) =>  Element.id === path.labelId);
                    if (checkLabel.length === 0) {
                        return new Apolloerror.UserInputError('This label is not exist or this belongs to another user')
                    }
                }
                // checking user notes
                const userNotes = await noteModel.find({ email: context.email });
                if (userNotes.length === 0) {
                    return new Apolloerror.UserInputError('User has not created any notes yet..First create Notes');
                }
                if (userNotes.length !== 0) {
                    const checkNotes = userNotes.filter((Element) =>  Element.id === path.noteId);
                    if (checkNotes.length === 0) {
                        return new Apolloerror.UserInputError('This note is not exist or this belongs to another user')
                    }
                }
                // adding Note to label
                await labelModel.find({ userId: context.id }).findOneAndUpdate({ _id:path.labelId },{ $addToSet: { noteId: path.noteId } });
                // adding Label to Note
                await noteModel.find({ email: context.email }).findOneAndUpdate({ _id:path.noteId },{ $addToSet: { labelId: path.labelId } });
                return "Label and notes are linked successfully.."
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },

        removeLabelandNotes: async (_, { path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                // checking user labels
                const userLabels = await labelModel.find({ userId: context.id });
                if (userLabels.length === 0) {
                    return new Apolloerror.UserInputError('user has not created any Labels yet..First create Label')
                }
                if (userLabels.length !== 0) {
                    const checkLabel = userLabels.filter((Element) =>  Element.id === path.labelId);
                    if (checkLabel.length === 0) {
                        return new Apolloerror.UserInputError('This label is not exist or this belongs to another user')
                    }
                }
                // checking user notes
                const userNotes = await noteModel.find({ email: context.email });
                if (userNotes.length === 0) {
                    return new Apolloerror.UserInputError('User has not created any notes yet..First create Notes');
                }
                if (userNotes.length !== 0) {
                    const checkNotes = userNotes.filter((Element) =>  Element.id === path.noteId);
                    if (checkNotes.length === 0) {
                        return new Apolloerror.UserInputError('This note is not exist or this belongs to another user')
                    }
                }
                // removing Note from label
                await labelModel.find({ userId: context.id }).findOneAndUpdate({ _id:path.labelId },{ $pull: { noteId: path.noteId } });
                // removing Label from Note
                await noteModel.find({ email: context.email }).findOneAndUpdate({ _id:path.noteId },{ $pull: { labelId: path.labelId } });
                // deleting this label if it is empty after removal of all notes from it
                await labelModel.find({ userId: context.id }).findOne({ _id:path.labelId }).deleteOne({ noteId:{ $exists: true, $size: 0 } })
                return "Label and notes are unlinked successfully.."
            } catch (error) {
                return Apolloerror.ApolloError('Internal Server Error');
            }
        }
    }
};

module.exports = userresolver;
