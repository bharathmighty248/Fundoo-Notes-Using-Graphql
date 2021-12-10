const Apolloerror = require('apollo-server-errors');
const labelModel = require('../models/label.model');
const noteModel = require('../models/note.model');

const labelresolver = {
    Query : {
        getAllLabels: async () =>  await labelModel.find()
    },
    Mutation: {
        // eslint-disable-next-line no-empty-pattern
        getLabels: async (_,{ },context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const checkLabels = await labelModel.find({ userId: context.id });
                if (checkLabels.length === 0) {
                    return new Apolloerror.UserInputError('User has not created any Labels till now');
                }
                return checkLabels
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },
        createLabel: async (_, { path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const userLabels = await labelModel.find({ userId: context.id });
                if (userLabels.length !== 0) {
                    const checkLabel = userLabels.filter((Element) =>  Element.labelName === path.labelname);
                    if (checkLabel.length !== 0) {
                        const userNotes = await noteModel.find({ email: context.email });
                        if (userNotes.length === 0) {
                            return new Apolloerror.UserInputError('User has not created any notes yet..First create Notes');
                        }
                        if (userNotes.length !== 0) {
                            const checkNotes = userNotes.filter((Element) =>  Element.id === path.noteId);
                            if (checkNotes.length === 0) {
                                return new Apolloerror.UserInputError('This note is not exist or this belongs to another user')
                            }
                        }
                        await labelModel.find({ userId: context.id }).findOneAndUpdate({ labelName:path.labelname },{ $addToSet: { noteId: path.noteId } });
                        return "Note Pushed Into Existing Label Sucessfully"
                    }
                }
                const userNotes = await noteModel.find({ email: context.email });
                if (userNotes.length === 0) {
                    return new Apolloerror.UserInputError('User has not created any notes yet..First create Notes');
                }
                if (userNotes.length !== 0) {
                    const checkNotes = userNotes.filter((Element) =>  Element.id === path.noteId);
                    if (checkNotes.length === 0) {
                        return new Apolloerror.UserInputError('This note is not exist or this belongs to another user')
                    }
                }
                const labelmodel = new labelModel({
                    userId: context.id,
                    noteId: path.noteId,
                    labelName: path.labelname,
                });
                await labelmodel.save();
                return "New Label Created Sucessfully"
            } catch (error) {
                console.log(error)
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },
        editLabel: async (_, { path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const userLabel = await labelModel.findOne({ labelName: path.labelname });
                if (!userLabel) {
                    return new Apolloerror.UserInputError('Label not found');
                }
                if (path.labelname && path.newLabelname != null) {
                    await labelModel.findOneAndUpdate({ labelName: path.labelname }, {
                        labelName: path.newLabelname
                    }, { new: true });
                    return "LabelName Edited Sucessfully"
                }
                const checkNote = await labelModel.findOne({ noteId: path.noteId });
                if (!checkNote) {
                    return new Apolloerror.UserInputError('Note not found');
                }
                let index = 0;
                while (index < userLabel.noteId.length) {
                    if (JSON.stringify(userLabel.noteId[index]) === JSON.stringify(path.noteId)) {
                        const itemToBeRemoved = userLabel.noteId[index];
                        if (userLabel.noteId.length === 1) {
                            await labelModel.findByIdAndDelete(userLabel.id);
                            return "Note Removed From Label Sucessfully and Empty Label is Removed"
                        }
                        await labelModel.findOneAndUpdate(
                            {
                                labelName: path.labelname
                            },
                            {
                                $pull: {
                                    noteId: itemToBeRemoved
                                },
                            }
                        )
                        return "Note Removed From Label Sucessfully"
                    }
                    index += 1;
                }
                return ({
                    labelname: path.labelname
                })
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },

        deleteLabel: async (_, { path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const userLabels = await labelModel.find({ userId: context.id });
                if (userLabels.length === 0) {
                    return new Apolloerror.UserInputError('user has not created any Labels yet..')
                }
                if (userLabels.length !== 0) {
                    const userLabel = userLabels.filter((Element) =>  Element.labelName === path.labelname);
                    if (userLabel.length === 0) {
                        return new Apolloerror.UserInputError('This label is not exist or this belongs to another user')
                    }
                }
                const label = path.labelname
                await labelModel.findOneAndDelete(label)
                return "label deleted successfully"
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        }
    }
}
module.exports = labelresolver;
