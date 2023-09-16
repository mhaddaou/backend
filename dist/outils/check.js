"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const check = (req) => {
    const { password, confirm, username, email } = req.body;
    const passhashed = bcrypt_1.default.hashSync(password, 10);
    return password === confirm ? { username, email, password: passhashed } : null;
};
exports.check = check;
//# sourceMappingURL=check.js.map