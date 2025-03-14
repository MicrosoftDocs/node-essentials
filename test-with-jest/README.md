# Jest for the Azure SDK for JavaScript

This subfolder is the source code for the [How to Test Azure SDK Integration in JavaScript Applications](https://learn.microsoft.com/azure/developer/javascript/sdk/test-sdk-integration). The purpose is to demonstrate unit test mocks for the Azure SDK for JavaScript. These specific examples use Azure Cosmos DB. 

## To run the test

1. `npm install`
2. `npm run build`
3. `npm test`

    ```console
    > test-with-jest@1.0.0 test
    > jest --detectOpenHandles dist --coverage

    PASS  dist/mock-function/lib/insert.spec.js (275.092 s)
    PASS  dist/fakes/fake-in-mem-db.spec.js
    PASS  dist/test-boilerplate/boilerplate-with-mock.spec.js
    PASS  dist/test-boilerplate/boilerplate.spec.js
    ---------------|---------|----------|---------|---------|-------------------
    File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    ---------------|---------|----------|---------|---------|-------------------
    All files      |   76.47 |    55.55 |   86.66 |   80.43 |                   
    data          |      75 |       20 |   83.33 |      75 |                   
    fake-data.js |     100 |      100 |     100 |     100 |                   
    model.js     |      50 |       20 |   66.66 |      50 | 13-22             
    lib           |   77.77 |    76.47 |   88.88 |   86.36 |                   
    insert.js    |   77.77 |    76.47 |   88.88 |   86.36 | 29-35             
    ---------------|---------|----------|---------|---------|-------------------

    Test Suites: 4 passed, 4 total
    Tests:       6 passed, 6 total
    Snapshots:   0 total
    Time:        285.194 s
    Ran all test suites matching /dist/i.
    ```

## Related content

* [Passwordless connections for Azure services](https://learn.microsoft.com/azure/developer/intro/passwordless-overview)
* [Cosmos DB keyless access to the service](https://learn.microsoft.com/azure/cosmos-db/role-based-access-control)
* [Jest](https://jestjs.io/)