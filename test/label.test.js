const EasyGraphQLTester = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');

const labelSchema = fs.readFileSync(path.join(__dirname, ".", "schema.gql"), "utf8");

describe("Query", () => {
    let tester;
    beforeAll(() => {
        tester = new EasyGraphQLTester(labelSchema);
    });

    test("Mocking label Query", () => {
        const query = `
        query {
            getAllLabels {
                labelName
                noteId
            }
        }`;

        const fixture = {
            data: {
                getAllLabels: [{
                    labelName: "first",
                    noteId: [
                        "6163d98f2137afa6e34d6c95"
                    ]
                }],
            },
        }
        tester.setFixture(fixture);
        const result = tester.mock({ query });
        expect(result.data.getAllLabels[0].labelName).toBe("first");
        expect(result.data.getAllLabels[0].noteId[0]).toBe("6163d98f2137afa6e34d6c95");
    });
});

describe("Mutations", () => {
    let tester;
    beforeAll(() => {
        tester = new EasyGraphQLTester(labelSchema);
    });

    // getLabels Testcase
    test("Mocking label mutation", () => {
        const query = `
        mutation {
            getLabels {
                labelName
                noteId
            }
        }`;

        const fixture = {
            data: {
                getLabels: [{
                    labelName: "first",
                    noteId: [
                        "6163d98f2137afa6e34d6c95"
                    ]
                }],
            },
        }
        tester.setFixture(fixture);
        const result = tester.mock({ query });
        expect(result.data.getLabels[0].labelName).toBe("first");
        expect(result.data.getLabels[0].noteId[0]).toBe("6163d98f2137afa6e34d6c95");
    });

    describe("Mutation", () => {
        // add Label Testcases
        test("Given_AddLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
            const mutation = `
            mutation addLabel($path : LabelInput) {
                addLabel(path: $path)
            }
            `;
            tester.test(false, mutation, { path:{} });
        });

        test("Given_AddLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputHasInvalidField", () => {
            const mutation = `
            mutation addLabel($path : LabelInput) {
                addLabel(path: $path)
            }
            `;
            tester.test(false, mutation, {
                path:{
                    email: "bharathpasumarthi248@gmail.com"
                }
            });
        });

        test("Given_AddLabel_MutationShouldPass_IfTheFirstArgIsTrue_AndTheInputHasvalidField", () => {
            const mutation = `
            mutation addLabel($path : LabelInput) {
                addLabel(path: $path)
            }
            `;
            tester.test(true, mutation, {
                path:{
                    noteId: "6163d98f2137afa6e34d6c95",
                    labelname: "first label"
                }
            });
        });

        // delete Label Testcases
        test("Given_deleteLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
            const mutation = `
            mutation deleteLabel($path : deleteLabelInput) {
                deleteLabel(path: $path)
            }
            `;
            tester.test(false, mutation, { path:{} });
        });

        test("Given_deleteLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputHasInvalidField", () => {
            const mutation = `
            mutation deleteLabel($path : deleteLabelInput) {
                deleteLabel(path: $path)
            }
            `;
            tester.test(false, mutation, {
                path:{
                    labelname: "first"
                }
            });
        });

        test("Given_deleteLabel_MutationShouldPass_IfTheFirstArgIsTrue_AndTheInputHasvalidField", () => {
            const mutation = `
            mutation deleteLabel($path : deleteLabelInput) {
                deleteLabel(path: $path)
            }
            `;
            tester.test(true, mutation, {
                path:{
                    labelId: "6163d98f2137afa6e34d6c95"
                }
            });
        });

        // edit Label Testcases
        test("Given_editLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
            const mutation = `
            mutation editLabel($path : EditLabelInput) {
                editLabel(path: $path)
            }
            `;
            tester.test(false, mutation, { path:{} });
        });

        test("Given_editLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputHasInvalidField", () => {
            const mutation = `
            mutation editLabel($path : EditLabelInput) {
                editLabel(path: $path)
            }
            `;
            tester.test(false, mutation, {
                path:{
                    noteId: "6163d98f2137afa6e34d6c95",
                    newLabelname: "new label"
                }
            });
        });

        test("Given_editLabel_MutationShouldPass_IfTheFirstArgIsTrue_AndTheInputHasvalidField", () => {
            const mutation = `
            mutation editLabel($path : EditLabelInput) {
                editLabel(path: $path)
            }
            `;
            tester.test(true, mutation, {
                path:{
                    labelname: "first label",
                    noteId: "6163d98f2137afa6e34d6c95",
                    newLabelname: "first edit label"
                }
            });
        });
    });
});
