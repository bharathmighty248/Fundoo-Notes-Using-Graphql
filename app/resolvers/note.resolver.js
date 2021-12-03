const Apolloerror = require('apollo-server-errors');
const userModel = require('../models/user.model');
const noteModel = require('../models/note.model');

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
        createNote: async (_,{ path }, context) => {
            if (!context.id) {
                return new Apolloerror.AuthenticationError('UnAuthenticated');
            }
            const userPresent = await userModel.findOne({ email: context.email });
            if (!userPresent) {
                return new Apolloerror.AuthenticationError("User is not registered. Please register first");
            }
            const notes =  new noteModel({
                title : path.title,
                description : path.description,
                email : context.email,
            });
            await notes.save();
            return notes
        },

        editNote: async (_,args, context) => {
            if (!context.id) {
                return new Apolloerror.AuthenticationError('UnAuthenticated');
            }
            const checkNotes = await noteModel.find({ email: context.email });
            if (!checkNotes) {
                return new Apolloerror.UserInputError('User has not created any notes till now');
            }
            const { noteId, title, description } = args.path;
            const updates = {}
            if (title !== undefined) {
                updates.title = title
            }
            if (description !== undefined) {
                updates.description = description
            }
            const notes = await noteModel.findByIdAndUpdate(noteId, updates, { new: true });
            return notes;
        },

        deleteNote: async (_, { path }, context) => {
            if (!context.id) {
                return new Apolloerror.AuthenticationError('UnAuthenticated');
            }
            const checkNotes = await noteModel.find({ email: context.email });
            if (!checkNotes) {
                return new Apolloerror.UserInputError('User has not created any notes till now');
            }
            await noteModel.findByIdAndDelete(path.noteId);
            return "ok, Note deleted"
        }
    }
}

module.exports = noteresolver;
