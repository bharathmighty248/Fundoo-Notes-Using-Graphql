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
    noteId: ID!
    labelname:String!
},

input EditLabelInput
{
    noteId: ID
    labelname: String!
    newLabelname:String
},

input deleteLabelInput {
    labelname: String!
},

type Label
{
    labelName: String!
    noteId: [String]!
},

input notebyId {
    noteId: ID!
},

input labelbyName{
    labelname: String!
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
    getNotebyId(path: notebyId): [Note]
    createNote(path: NoteInput): Note
    editNote(path: editInput): Note
    deleteNote(path: deleteInput): String

    getLabels: [Label]
    getLabelbyName(path: labelbyName): [Label]
    addLabel(path: LabelInput):String
    deleteLabel(path: deleteLabelInput ):String
    editLabel(path: EditLabelInput):String
}
`;

module.exports = usertypeDefs;
