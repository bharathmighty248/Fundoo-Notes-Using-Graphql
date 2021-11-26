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

    type Query{
        getAllNotes : [Note] 
        getNotesbyId(id: ID): Note
    },

    type Mutation {
        createNote(path: NoteInput): Note
        editNote(id: ID, path: NoteInput): Note
    }
`;

module.exports = notetypeDefs;
