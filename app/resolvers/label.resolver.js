const Apolloerror = require('apollo-server-errors');
const labelModel = require('../models/label.model');
const noteModel = require('../models/note.model');
const redisjs = require('../../utilities/redis');

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

        getLabelbyName: async (_, { path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const cachevalue = await redisjs.redisLabelbyName(path.labelname);
                if (cachevalue) {
                    const doc = JSON.parse(cachevalue);
                    return doc;
                }
                const dblabel = await labelModel.find({ userId: context.id,labelName: path.labelname });
                if (dblabel.length === 0) {
                    return new Apolloerror.UserInputError('This label is not exists');
                }
                redisjs.setData(path.labelname,JSON.stringify(dblabel));
                return dblabel;
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },

        addLabel: async (_, { path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const checkNotes = await noteModel.find({ email: context.email,_id: path.noteId });
                if (checkNotes.length === 0) {
                    return new Apolloerror.UserInputError('This note is not exist or this belongs to another user');
                }
                const checkLabel = await labelModel.find({ userId: context.id, labelName: path.labelname });
                if (checkLabel.length !== 0) {
                    await labelModel.find({ userId: context.id }).findOneAndUpdate({ labelName:path.labelname },{ $addToSet: { noteId: path.noteId } });
                    return "Note Added Into Existing Label Sucessfully"
                }
                const labelmodel = new labelModel({
                    userId: context.id,
                    noteId: path.noteId,
                    labelName: path.labelname,
                });
                await labelmodel.save();
                return "note Added Into new Label Sucessfully"
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
                const checkLabel = await labelModel.find({ userId: context.id, labelName: path.labelname });
                if (checkLabel.length !== 0) {
                    if (path.noteId != null) {
                        await labelModel.find({ userId: context.id }).findOneAndUpdate({ labelName:path.labelname },{ $pull: { noteId: path.noteId } });
                    }
                    if (path.labelname && path.newLabelname != null) {
                        await labelModel.find({ userId: context.id }).findOneAndUpdate({ labelName:path.labelname },{ labelName:path.newLabelname });
                        await labelModel.find({ userId: context.id }).findOne({ labelName:path.newLabelname }).deleteOne({ noteId:{ $exists: true, $size: 0 } });
                    }
                    await labelModel.find({ userId: context.id }).findOne({ labelName:path.labelname }).deleteOne({ noteId:{ $exists: true, $size: 0 } });
                    return "Label Edited Successfully"
                }
                return new Apolloerror.UserInputError('This Label is not exist or this belongs to another user');
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },

        deleteLabel: async (_, { path }, context) => {
            try {
                if (!context.id) {
                    return new Apolloerror.AuthenticationError('UnAuthenticated');
                }
                const checkLabel = await labelModel.find({ userId: context.id, labelName: path.labelname });
                if (checkLabel.length !== 0) {
                    const label = path.labelname
                    await labelModel.findOneAndDelete(label)
                    return "label deleted successfully"
                }
                return new Apolloerror.UserInputError('This label is not exist or this belongs to another user');
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        }
    }
}
module.exports = labelresolver;
