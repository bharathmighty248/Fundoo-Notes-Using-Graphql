const userModel = require('../models/user.model')
const joiValidation = require('../validations/validation')
const Apolloerror = require('apollo-server-errors')

const resolvers = {
    Query : {

        getAllUsers : async () => {
            return await userModel.find()
        }
    },

    Mutation: {
        registerUser : async ( _, { path } ) => {
            const usermodel = new userModel({
                firstName: path.firstName,
                lastName: path.lastName,
                email: path.email,
                password: path.password,
            });

            const Validation = joiValidation.authRegister.validate(usermodel._doc);
            if(Validation.error){
                return new Apolloerror.ValidationError(Validation.error);
            }

            const existingUser = await userModel.findOne({ email: path.email });
            if(existingUser){
                return new Apolloerror.UserInputError("Email already exists");
            }

            usermodel.save();
            return usermodel;
        },

        loginUser : async (_, { path }) => {
            const loginmodel = {
                email : path.email,
                password : path.password
            };

            const Validation = joiValidation.authLogin.validate(loginmodel);
            if(Validation.error){
                return new Apolloerror.ValidationError(Validation.error);
            }

            const userPresent = await userModel.findOne({ email: path.email });
            if(!userPresent){
                return new Apolloerror.AuthenticationError("Email id is not registered");
            }

            return {
                id: userPresent.id,
                firstName: userPresent.firstName,
                lastName: userPresent.lastName,
                email: userPresent.email
            }
        }
        
    }
};

module.exports = resolvers;