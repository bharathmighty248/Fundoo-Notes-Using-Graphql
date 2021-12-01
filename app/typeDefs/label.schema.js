const { gql } = require('apollo-server-express');

const labeltypeDefs = gql`
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

    type Query {
        getLabel(id: ID):Label
    }

    type Mutation{
        createLabel(path: LabelInput):Label
        deleteLabel(id: ID):String
        editLabel(id: ID, path: LabelInput):Label
    }

`
module.exports = labeltypeDefs;
