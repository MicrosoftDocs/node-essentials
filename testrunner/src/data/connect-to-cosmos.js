"use strict";
// connect-to-cosmos.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
exports.connectToCosmosWithoutKey = connectToCosmosWithoutKey;
exports.connectToContainer = connectToContainer;
exports.getUniqueId = getUniqueId;
const cosmos_1 = require("@azure/cosmos");
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return cosmos_1.Container; } });
const identity_1 = require("@azure/identity");
require("dotenv/config");
const uuid_1 = require("uuid");
function connectToCosmosWithoutKey() {
    const endpoint = process.env.COSMOS_DB_ENDPOINT;
    const credential = new identity_1.DefaultAzureCredential();
    const client = new cosmos_1.CosmosClient({ endpoint, aadCredentials: credential });
    return client;
}
function connectToContainer() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = connectToCosmosWithoutKey();
        const databaseName = process.env.COSMOS_DATABASE_NAME;
        const containerName = process.env.COSMOS_CONTAINER_NAME;
        // Ensure the database exists
        const { database } = yield client.databases.createIfNotExists({
            id: databaseName,
        });
        // Ensure the container exists
        const { container } = yield database.containers.createIfNotExists({
            id: containerName,
        });
        return container;
    });
}
function getUniqueId() {
    return (0, uuid_1.v4)();
}
