# Unit testing for the Azure SDK for JavaScript

This subfolder is the source code for the [TBD article](). The purpose is to demonstrate unit test mocks for the Azure SDK for JavaScript. These specific examples use Azure Cosmos DB. 

## To run the test

1. `npm install`
2. `npm run build`
3. `npm test`

    ```console
    > unit-testing@1.0.0 test
    > jest dist
    
     PASS  dist/fakes/fake-in-mem-db.spec.js
     PASS  dist/mock-function/lib/insert.spec.js
    
    Test Suites: 2 passed, 2 total
    Tests:       4 passed, 4 total
    Snapshots:   0 total
    Time:        4.247 s, estimated 5 s
    Ran all test suites matching /dist/i.
    ```

## Related content

* [Passwordless connections for Azure services](https://learn.microsoft.com/azure/developer/intro/passwordless-overview)
* [Cosmos DB keyless access to the service](https://learn.microsoft.com/azure/cosmos-db/role-based-access-control)
* [Node.js Test Runner](https://nodejs.org/docs/latest/api/test.html#test-runner)