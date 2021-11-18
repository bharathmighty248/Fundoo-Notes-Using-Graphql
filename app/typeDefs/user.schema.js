const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User{
    id : ID!
    firstName : String!
    lastName : String!
    email : String!
    password : String!
},

input UserInput{
    firstName : String!
    lastName : String!
    email : String!
    password : String!
},

type Login{
    id: ID!
    firstName: String!
    lastName: String!
    email : String!
    token : String!

},

input LoginInput{
    email : String!
    password : String!
},

type Query{
    getAllUsers : [User] 
},

type Mutation {
    registerUser( path : UserInput ):User
    loginUser( path : LoginInput ):Login
}
`;

module.exports = typeDefs;