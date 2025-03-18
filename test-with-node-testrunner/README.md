# Node.js native test runner for the Azure SDK for JavaScript

This subfolder is the source code for the [How to Test Azure SDK Integration in JavaScript Applications](https://learn.microsoft.com/azure/developer/javascript/sdk/test-sdk-integration). The purpose is to demonstrate unit test mocks for the Azure SDK for JavaScript. These specific examples use Azure Cosmos DB. 

Use Azure CLI to create Cosmos DB resource if you intend to insert a document with the application code against the cloud resource. [Script](../scripts/create-cosmos-db-resources.sh)

## To run the test

1. `npm install`
3. `npm test`

    ```console
    > test-with-node-testrunner@1.0.0 build
    > rm -rf dist && tsc

    ▶ Spies
    ✔ should verify calls in a mock (2.466559ms)
    ✔ Spies (3.917687ms)
    ▶ Stub Test Suite
    ✔ should stub APIs (3.878824ms)
    ✔ should stub different values for API calls (1.967753ms)
    ✔ Stub Test Suite (7.46516ms)
    ▶ boilerplate with mock
    ✔ should <do something> if <situation is present> (2.118992ms)
    ✔ boilerplate with mock (3.480984ms)
    ▶ boilerplate
    ✔ should <do something> if <situation is present> (1.587994ms)
    ✔ boilerplate (2.865063ms)
    ▶ In-Mem DB
    ✔ should save and return the correct value (3.486273ms)
    ✔ In-Mem DB (4.931667ms)
    ▶ SDK
    ✔ should insert document successfully (6.777565ms)
    ✔ should return verification error if input is not verified (2.334627ms)
    ✔ should return error if db insert fails (0.827453ms)
    ✔ SDK (11.135955ms)
    ℹ tests 9
    ℹ suites 6
    ℹ pass 9
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 281634.635767
    ℹ start of coverage report
    ℹ ------------------------------------------------------------------------------------------
    ℹ file                               | line % | branch % | funcs % | uncovered lines
    ℹ ------------------------------------------------------------------------------------------
    ℹ dist                               |        |          |         | 
    ℹ  src                               |        |          |         | 
    ℹ   data                             |        |          |         | 
    ℹ    connect-to-cosmos.js            |  36.96 |   100.00 |    0.00 | 4-10 21-25 27-41 43-44
    ℹ    fake-data.js                    | 100.00 |   100.00 |  100.00 | 
    ℹ    model.js                        |  47.83 |   100.00 |   66.67 | 12-23
    ℹ    verify.js                       |  72.73 |   100.00 |    0.00 | 7-9
    ℹ   lib                              |        |          |         | 
    ℹ    insert.js                       |  82.22 |    75.00 |   90.00 | 32-39
    ℹ  test                              |        |          |         | 
    ℹ   01-spies.test.js                 | 100.00 |    85.71 |  100.00 | 
    ℹ   02-stubs.test.js                 |  92.47 |    88.24 |   89.66 | 19-25
    ℹ   boilerplate-with-mock.test.js    |  90.48 |    84.21 |   81.25 | 21-24
    ℹ   boilerplate.test.js              | 100.00 |    90.00 |   72.73 | 
    ℹ   fake-in-mem-db.test.js           | 100.00 |    90.91 |  100.00 | 
    ℹ   insert.test.js                   |  94.83 |    89.66 |   77.78 | 37 62 79-81 92
    ℹ ------------------------------------------------------------------------------------------
    ℹ all files                          |  86.44 |    87.05 |   80.51 | 
    ℹ ------------------------------------------------------------------------------------------
    ℹ end of coverage report
    ```

## Related content

* [Passwordless connections for Azure services](https://learn.microsoft.com/azure/developer/intro/passwordless-overview)
* [Cosmos DB keyless access to the service](https://learn.microsoft.com/azure/cosmos-db/role-based-access-control)
* [Node.js Test Runner](https://nodejs.org/docs/latest/api/test.html#test-runner)