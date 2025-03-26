# Vitest for the Azure SDK for JavaScript

This subfolder is the source code for the [How to Test Azure SDK Integration in JavaScript Applications](https://learn.microsoft.com/azure/developer/javascript/sdk/test-sdk-integration). The purpose is to demonstrate unit test mocks for the Azure SDK for JavaScript. These specific examples use Azure Cosmos DB. 

Use Azure CLI to create Cosmos DB resource if you intend to insert a document with the application code against the cloud resource. [Script](../scripts/create-cosmos-db-resources.sh)

## To run the test

1. `npm install`
2. `npm run build`
3. `npm test`

    ```console
    > test-with-vitest@1.0.0 test
    > vitest run --coverage


    RUN  v3.0.8 /workspaces/node-essentials/test-with-vitest
        Coverage enabled with istanbul

    ✓ tests/02-stubs.test.ts (2 tests) 6ms
    ✓ tests/boilerplate.test.ts (1 test) 6ms
    ✓ tests/boilerplate-with-mock.test.ts (1 test) 5ms
    ✓ tests/fake-in-mem-db.test.ts (1 test) 10ms
    ✓ tests/01-spies.test.ts (1 test) 7ms
    ✓ tests/insert.test.ts (3 tests) 11ms

    Test Files  6 passed (6)
        Tests  9 passed (9)
    Start at  18:36:27
    Duration  14.01s (transform 5.89s, setup 0ms, collect 12.28s, tests 45ms, environment 2ms, prepare 12.26s)

    % Coverage report from istanbul
    -----------------------|---------|----------|---------|---------|-------------------
    File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    -----------------------|---------|----------|---------|---------|-------------------
    All files              |   36.95 |    31.25 |   42.85 |   36.95 |                   
    src                   |       0 |      100 |       0 |       0 |                   
    index.ts             |       0 |      100 |       0 |       0 | 7-16              
    src/data              |   32.14 |       20 |      50 |   32.14 |                   
    connect-to-cosmos.ts |       0 |      100 |       0 |       0 | 12-37             
    fake-data.ts         |     100 |      100 |     100 |     100 |                   
    model.ts             |      25 |       20 |   66.66 |      25 | 26-38             
    verify.ts            |       0 |      100 |       0 |       0 | 6-7               
    src/lib               |   72.72 |       50 |     100 |   72.72 |                   
    insert.ts            |   72.72 |       50 |     100 |   72.72 | 30-36             
    -----------------------|---------|----------|---------|---------|-------------------
    ```

## Related content

* [Passwordless connections for Azure services](https://learn.microsoft.com/azure/developer/intro/passwordless-overview)
* [Cosmos DB keyless access to the service](https://learn.microsoft.com/azure/cosmos-db/role-based-access-control)
* [Vitest](https://main.vitest.dev/)