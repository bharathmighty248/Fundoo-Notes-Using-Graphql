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
                password
            }
        }`;

        const fixture = {
            data: {
                getAllUsers: [{
                    id: "61960dab3937e474cb2bf88a",
                    firstName: "bharath",
                    lastName: "pasumarthi",
                    email: "bharathtest8@gmail.com",
                    password: "bharath@8"
                }]
            }
        }
        tester.setFixture(fixture);
        const result = tester.mock({ query });
        expect(result.data.getAllUsers[0].id).toBe("61960dab3937e474cb2bf88a");
        expect(result.data.getAllUsers[0].firstName).toBe("bharath");
        expect(result.data.getAllUsers[0].lastName).toBe("pasumarthi");
        expect(result.data.getAllUsers[0].email).toBe("bharathtest8@gmail.com");
        expect(result.data.getAllUsers[0].password).toBe("bharath@8");
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
            mutation registerUser($path : UserInput) {
                registerUser(path: $path) {
                    firstName
                    lastName
                    email
                    password
                }
            }
            `;
            tester.test(false, mutation, {path:{}});
        });
        test("Given_registerUser_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
            const mutation = `
            mutation registerUser($path: UserInput) {
                registerUser(path: $path) {
                    firstName
                    lastName
                    email
                    password
                }
            }
            `;
            tester.test(false, mutation, {
                path: {
                    firstName: "bharath",
                    lastName: "pasumaarthi",
                    email: "bharathtest9@gmail.com"
                }
            });
        });
        test("Given_registerUser_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
            const mutation = `
            mutation registerUser($path: UserInput) {
                registerUser(path: $path) {
                    firstName
                    lastName
                    email
                    password
                }
            }
            `;
            tester.test(true, mutation, {
                path:{
                    firstName: "bharath",
                    lastName: "pasumarthi",
                    email: "bharathtest9@gmail.com",
                    password: "bharath@9"
                }
            });
        });


        //loginUser testcases

        test("Given_loginUser_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
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
            tester.test(false, mutation, {path:{}});
        });
        test("Given_loginUser_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
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
            tester.test(false, mutation, {
                path:{
                    firstName: "bharath",
                    lastName: "pasumarthi",
                    email: "bharathtest10@gmail.com"
                }
            });
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
            tester.test(true, mutation, {
                path:{
                    email: "bharathtest8@gmail.com",
                    password: "bharath@8"
                }
            });
        });  
    });    
});