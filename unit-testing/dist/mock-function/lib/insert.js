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
exports.insertDocument = insertDocument;
const verify_1 = require("../data/verify");
function insertDocument(container, doc) {
    return __awaiter(this, void 0, void 0, function* () {
        const isVerified = (0, verify_1.inputVerified)(doc);
        if (!isVerified) {
            return { message: "Verification failed" };
        }
        try {
            const { resource } = yield container.items.create({
                id: doc.id,
                name: `${doc.first} ${doc.last}`
            });
            return resource;
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.code === 409) {
                    return { message: "Insertion failed: Duplicate entry", code: 409 };
                }
                return { message: error.message, code: error.code };
            }
            else {
                return { message: "An unknown error occurred", code: 500 };
            }
        }
    });
}
