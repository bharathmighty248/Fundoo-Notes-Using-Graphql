const Post = require('../models/user.model')

const resolvers = {
    Query : {

        getAllUsers : async () => {
            return await Post.find()
        },

        
    },

    Mutation: {
        registerUser : async ( parent, args, context, info ) => {
            const { firstName, lastName, email, password } = args.user
            const user = new Post({ firstName, lastName, email, password})
            await user.save()
            return user
        },

        loginUser : async (parent, args, context, info) => {
            const login = {
                email : args.email,
                password : args.password
            }
            
        }
        
    }
};

module.exports = resolvers;