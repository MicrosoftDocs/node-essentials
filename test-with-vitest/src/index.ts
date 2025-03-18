import CosmosConnector from './data/connect-to-cosmos.js';
import { createTestInput } from './data/fake-data.js';
import { insertDocument } from './lib/insert.js';
try {
    const container = await CosmosConnector.connectToContainer();
    const input = createTestInput();
    const result = await insertDocument(container, input);
    console.log(result);
}
catch (error) {
    console.error(error);
    process.exit(1);
}
