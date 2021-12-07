const Apolloerror = require('apollo-server-errors');
const labelModel = require('../models/label.model');

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
                const checkLabel = await labelModel.findOne({ labelName: path.labelname });
                if (checkLabel) {
                    for (index = 0; index < checkLabel.noteId.length; index += 1) {
                        if (JSON.stringify(checkLabel.noteId[index]) === JSON.stringify(path.noteId)) {
                            return new ApolloError.UserInputError('This note is already added');
                        }
                    }
                    checkLabel.noteId.push(path.noteId)
                    await checkLabel.save();
                    return "Note Pushed Into Existing Label Sucessfully"
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
                const checkLabel = await labelModel.findOne({ labelName: path.labelname });
                if (!checkLabel) {
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
                while (index < checkLabel.noteId.length) {
                    if (JSON.stringify(checkLabel.noteId[index]) === JSON.stringify(path.noteId)) {
                        const itemToBeRemoved = checkLabel.noteId[index];
                        if (checkLabel.noteId.length === 1) {
                            await labelModel.findByIdAndDelete(checkLabel.id);
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
                console.log(error);
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
                    const checkLabel = userLabels.filter((Element) =>  Element.id === path.labelId);
                    if (checkLabel.length === 0) {
                        return new Apolloerror.UserInputError('This label is not exist or this belongs to another user')
                    }
                }
                const id = path.labelId
                await labelModel.findByIdAndDelete(id)
                return "label deleted successfully"
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        }
    }
}
module.exports = labelresolver;
