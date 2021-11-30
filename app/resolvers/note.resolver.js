const Apolloerror = require('apollo-server-errors');
const userModel = require('../models/user.model');
const noteModel = require('../models/note.model');

const noteresolver = {

    Query : {
        getAllNotes: async () =>  await noteModel.find(),
        getNotesbyId: async (_,{ id }) => await noteModel.findById(id)
    },

    Mutation : {
        createNote: async (_,{ path }) => {
            const notes =  new noteModel({
                title : path.title,
                description : path.description,
                email : path.email,
            })

            const userPresent = await userModel.findOne({ email: path.email });
            if (!userPresent) {
                return new Apolloerror.AuthenticationError("User is not registered. Please register first");
            }
            await notes.save();
            return notes
        },

        editNote: async (_,args) => {
            const { id, title, description } = args.path;
            const updates = {}
            if (title !== undefined) {
                updates.title = title
            }
            if (description !== undefined) {
                updates.description = description
            }
            const notes = await noteModel.findByIdAndUpdate(id, updates, { new: true });
            return notes;
        },

        deleteNote: async (_, { path }) => {
            await noteModel.findByIdAndDelete(path.id);
            return "ok, Post deleted"
        }
    }
}

module.exports = noteresolver;
