"use strict";
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
const insert_1 = require("./lib/insert");
const connect_to_cosmos_1 = require("./data/connect-to-cosmos");
const fake_data_1 = require("./data/fake-data");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = yield (0, connect_to_cosmos_1.connectToContainer)();
        const input = (0, fake_data_1.createTestInput)();
        return yield (0, insert_1.insertDocument)(container, input);
    });
}
main()
    .then((doc) => console.log(doc))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
