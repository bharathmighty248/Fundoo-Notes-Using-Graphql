const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User{
    id : ID!
    firstName : String!
    lastName : String!
    email : String!
    password : String!
},

type AuthUser{
    id : ID!
    firstName : String!
    lastName : String!
    email : String!
    password : String!
    token: String
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
    getAllUsers : [AuthUser] 
},

type Mutation {
    registerUser( path : UserInput ):User
    loginUser( path : LoginInput ):Login
}
`;

module.exports = typeDefs;