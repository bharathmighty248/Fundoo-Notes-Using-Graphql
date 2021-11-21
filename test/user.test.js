const EasyGraphQLTester = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');

const userSchema = fs.readFileSync(
    path.join(__dirname, ".", "schema.gql"), "utf8"
);

describe("Query", () => {
    let tester;
    beforeAll(() => {
        tester = new EasyGraphQLTester(userSchema);
    });

    test("Mocking User Query", () => {
        const query = `
        query {
            getAllUsers {
                id
                firstName
                lastName
                email
            }
        }`;

        const fixture = {
            data: {
                getAllUsers: [{
                    id: "61960dab3937e474cb2bf88a",
                    firstName: "bharath",
                    lastName: "pasumarthi",
                    email: "bharathtest8@gmail.com"
                }]
            }
        }
        tester.setFixture(fixture);
        const result = tester.mock({ query });
        expect(result.data.getAllUsers[0].id).toBe("61960dab3937e474cb2bf88a");
        expect(result.data.getAllUsers[0].firstName).toBe("bharath");
        expect(result.data.getAllUsers[0].lastName).toBe("pasumarthi");
        expect(result.data.getAllUsers[0].email).toBe("bharathtest8@gmail.com");

    });
});

describe("Mutations", () => {
    let tester;
    beforeAll(() => {
        tester = new EasyGraphQLTester(userSchema);
    });

    describe("Mutations", () => {
        //registerUser Testcases

        test("Given_registerUser_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
            const mutation = `
            mutation registerUser($path : UserInput!) {
                registerUser(path: $path) {
                    firstName
                    lastName
                    email
                    password
                }
            }
            `;
            tester.test(false, mutation, {});
        });
        test("Given_registerUser_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
            const mutation = `
            mutation registerUser($path: UserInput!) {
                registerUser(path: $path) {
                    firstName
                    lastName
                    email
                    password
                }
            }
            `;
            tester.test(false, mutation, [
                {
                    firstName: "bharath",
                    lastName: "pasumaarthi",
                    email: "bharathtest9@@gmail.com" 
                }
            ]);
        });
        test("Given_registerUser_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
            const mutation = `
            mutation registerUser($path: UserInput) {
                registerUser(path: $path) {
                    firstName
                }
            }
            `;
            tester.test(true, mutation, {
                firstName: "bharath",
                lastName: "pasumarthi",
                email: "bharathtest9@gmail.com"
            });
        });


        //loginUser testcases

        test("Given_loginUser_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
            const mutation = `
            mutation loginUser($input:LoginInput) {
                loginUser(input: $input) {
                    id
                    token
                    firstName
                    lastName
                    email
                }
              }
            `;
            tester.test(false, mutation, {});
        });
        test("Given_loginUser_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
            const mutation = `
            mutation loginUser($path:InvalidInput) {
                loginUser(path: $path) {
                    id
                    firstName
                    lastName
                    email
                }
            }
            `;
            tester.test(false, mutation, [
                {
                    firstName: "bharath",
                    lastName: "pasumarthi",
                    email: "bharathtest10@gmail.com"
                }
            ]);
        });
        test("Given_loginUser_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
            const mutation = `
            mutation loginUser($path:LoginInput) {
                loginUser(path: $path) {
                    id
                    firstName
                    lastName
                    email
                }
            }
            `;
            tester.test(true, mutation, [
                {
                    firstName: "bharath",
                    lastName: "pasumarthi",
                    email: "bharathtest8@gmail.com"
                }
            ]);
        });  
    });    
});