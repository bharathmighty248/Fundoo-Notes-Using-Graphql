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
    _id: ID
    email: String
    title: String
    description: String
    labelId: [String]
}

input NoteInput {
    title: String!
    description: String!
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

input EditLabelInput
{
    id: ID!
    newLabelname:String!
},

input deleteLabelInput {
    labelId: ID!
},

type Label
{
    labelName: String!
    noteId: [String]!
},

input addLabelInput{
    labelId: ID!
    noteId: ID!
}

type Query{
    getAllUsers : [User]
    getAllNotes : [Note]
    getAllLabels: [Label]
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

    getLabels: [Label]
    createLabel(path: LabelInput):Label
    deleteLabel(path: deleteLabelInput ):String
    editLabel(path: EditLabelInput):Label

    addLabelandNotes(path: addLabelInput): String
}
`;

module.exports = usertypeDefs;
