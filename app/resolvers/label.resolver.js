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
                console.log(error)
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },
        createLabel: async (_, { path }) => {
            try {
                const checkLabel = await labelModel.findOne({ labelName: path.labelname });
                if (checkLabel) {
                    return new Apolloerror.UserInputError('label name is already exists..please try another name')
                }
                const labelmodel = new labelModel({
                    labelName: path.labelname,
                });
                await labelmodel.save();
                return ({
                    labelName: path.labelname,
                    message: `${path.labelname} created successfully`
                })
            } catch (error) {
                console.log(error)
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },
        editLabel: async (_, args) => {
            try {
                const { id } = args
                const { labelname } = args.path
                const updates = {}
                updates.labelName = labelname
                const label = await labelModel.findByIdAndUpdate(id,updates,{ new: true })
                return label;
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        },

        deleteLabel: async (_, args) => {
            try {
                const { id } = args
                await labelModel.findByIdAndDelete(id)
                return "label deleted successfully"
            } catch (error) {
                return new Apolloerror.ApolloError('Internal Server Error');
            }
        }
    }
}
module.exports = labelresolver;
