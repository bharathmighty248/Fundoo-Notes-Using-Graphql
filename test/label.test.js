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
});
