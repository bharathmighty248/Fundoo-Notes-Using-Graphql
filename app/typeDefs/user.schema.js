const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User{
    id : ID
    firstName : String!
    lastName : String!
    email : String!
    password : String!
}

input UserInput{
    firstName : String!
    lastName : String!
    email : String!
    password : String!
}

type Login{
    email : String!
    password : String!
}

input LoginInput{
    email : String!
    password : String!
}

type Query{
    getAllUsers : [User] 
}

type Mutation {
    registerUser( user : UserInput ):User
    loginUser( login : LoginInput ):Login
}
`;

module.exports = typeDefs;