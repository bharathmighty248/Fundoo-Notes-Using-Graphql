const Apolloerror = require('apollo-server-errors');
const labelModel = require('../models/label.model');

const labelresolver = {
    Query : {
        getLabel: async (_,{ id }) => {
            const label = await labelModel.findById(id);
            return label
        }
    },
    Mutation: {
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
