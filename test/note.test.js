const EasyGraphQLTester = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');

const noteSchema = fs.readFileSync(path.join(__dirname, ".", "schema.gql"), "utf8");

describe("Query", () => {
    let tester;
    beforeAll(() => {
        tester = new EasyGraphQLTester(noteSchema);
    });

    test("Mocking note Query", () => {
        const query = `
        query {
            getAllNotes {
                id
                email
                title
                description
            }
        }`;

        const fixture = {
            data: {
                getAllNotes: [{
                    id: "61a0d1541ebc2fc0ee38d89f",
                    email: "bharathpasumarthi248@gmail.com",
                    title: "first note title",
                    description: "first note description"
                }],
            },
        }
        tester.setFixture(fixture);
        const result = tester.mock({ query });
        expect(result.data.getAllNotes[0].id).toBe("61a0d1541ebc2fc0ee38d89f");
        expect(result.data.getAllNotes[0].email).toBe("bharathpasumarthi248@gmail.com");
        expect(result.data.getAllNotes[0].title).toBe("first note title");
        expect(result.data.getAllNotes[0].description).toBe("first note description");
    });
});
