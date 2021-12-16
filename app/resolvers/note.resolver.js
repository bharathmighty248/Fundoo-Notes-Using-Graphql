const Apolloerror = require('apollo-server-errors');
const noteModel = require('../models/note.model');
const redisjs = require('../../utilities/redis');

const noteresolver = {

    Query : {
        getAllNotes: async () =>  await noteModel.find()
    },

    Mutation : {
        // eslint-disable-next-line no-empty-pattern
        getNotes: async (_,{ },context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const checkNotes = await noteModel.find({ email: context.email });
                if (checkNotes.length === 0) {
                    return new Apolloerror.UserInputError('User has not created any notes till now');
                }
                return checkNotes
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },

        getNotebyId: async (_,{ path },context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const cachevalue = await redisjs.redisNotebyId(path.noteId);
                if (cachevalue) {
                    const doc = JSON.parse(cachevalue);
                    return doc;
                }
                const dbnotes = await noteModel.find({ email: context.email,_id: path.noteId });
                if (dbnotes.length === 0) {
                    return new Apolloerror.UserInputError('This notes is not exists');
                }
                redisjs.setData(path.noteId,JSON.stringify(dbnotes));
                return dbnotes;
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error')
            }
        },

        createNote: async (_,{ path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const notes =  new noteModel({
                    title : path.title,
                    description : path.description,
                    email : context.email,
                });
                await notes.save();
                return notes
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },

        editNote: async (_,{ path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const userNotes = await noteModel.find({ email: context.email });
                if (userNotes.length === 0) {
                    return new Apolloerror.UserInputError('User has not created any notes till now');
                }
                if (userNotes.length !== 0) {
                    const checkNotes = userNotes.filter((Element) =>  Element.id === path.noteId);
                    if (checkNotes.length === 0) {
                        return new Apolloerror.UserInputError('This note is not exist or this belongs to another user')
                    }
                }
                const { noteId, title, description } = path;
                const updates = { title,description }
                if (title !== undefined) {
                    updates.title = title
                }
                if (description !== undefined) {
                    updates.description = description
                }
                const notes = await noteModel.findByIdAndUpdate(noteId, updates, { new: true });
                return notes;
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },

        deleteNote: async (_, { path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const userNotes = await noteModel.find({ email: context.email });
                if (userNotes.length === 0) {
                    return new Apolloerror.UserInputError('User has not created any notes till now');
                }
                if (userNotes.length !== 0) {
                    const checkNotes = userNotes.filter((Element) =>  Element.id === path.noteId);
                    if (checkNotes.length === 0) {
                        return new Apolloerror.UserInputError('This note is not exist or this belongs to another user')
                    }
                }
                await noteModel.findByIdAndDelete(path.noteId);
                return "Note deleted successfully"
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        }
    }
}

module.exports = noteresolver;
