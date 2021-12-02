const { gql } = require('apollo-server-express');

const usertypeDefs = gql`
type User{
    id : ID!
    firstName : String!
    lastName : String!
    email : String!
    password : String!
},

type authUser{
    _id:ID
    token:String
    firstName:String
    lastName:String
    email:String
}

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

type sentMail{
    email: String
    message: String
},

input forgotPassword{
    email: String!
},

type reset{
    id : ID!
    firstName : String!
    lastName : String!
    email : String!
}

input resetPassword{
    email: String!
    newPassword: String!
    resetcode: String!
},

type Note {
    noteId: ID
    email: String
    title: String
    description: String
}

input NoteInput {
    title: String
    description: String
}

input editInput {
    noteId: ID!
    title: String
    description: String
}

input deleteInput {
    noteId: ID!
},

input LabelInput
{
    labelname:String!
},

type Label
{
    id: ID
    labelName: String
    message: String
},

type Query{
    getAllUsers : [User]
    getAllNotes : [Note]
    getLabel(id: ID):Label
},

type Mutation {
    registerUser( path : UserInput ):User
    loginUser( path : LoginInput ):authUser
    forgotPassword( path : forgotPassword ):sentMail
    resetPassword( path : resetPassword ):reset

    getNotes: [Note]
    createNote(path: NoteInput): Note
    editNote(path: editInput): Note
    deleteNote(path: deleteInput): String

    createLabel(path: LabelInput):Label
    deleteLabel(id: ID):String
    editLabel(id: ID, path: LabelInput):Label
}
`;

module.exports = usertypeDefs;
