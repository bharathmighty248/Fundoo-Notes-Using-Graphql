const { gql } = require('apollo-server-express');

const notetypeDefs = gql`

    type Note {
        id: ID
        email: String
        title: String
        description: String
    }

    input NoteInput {
        email: String
        title: String
        description: String
    }

    input editInput {
        id: ID!
        email: String!
        title: String
        description: String
    }

    type Query{
        getAllNotes : [Note] 
        getNotesbyId(id: ID): Note
    },

    type Mutation {
        createNote(path: NoteInput): Note
        editNote(path: editInput): Note
        deleteNote(id: ID): String
    }
`;

module.exports = notetypeDefs;
