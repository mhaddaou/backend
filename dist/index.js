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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("./Models/userModel"));
const retUsers_1 = require("./outils/retUsers");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
dotenv_1.default.config();
mongoose_1.default.connect(`mongodb+srv://mhaddaou:iQ8Ij9h9GgfBNZeC@cluster0.baz83mq.mongodb.net/mern?retryWrites=true&w=majority`).then(() => {
    console.log('db connection established');
}).catch((err) => {
    console.log('db connection error ', err);
});
app.get('/', (_req, res) => {
    return res.send('Express Typescript on Vercel');
});
app.get('/ping', (_req, res) => {
    return res.send('pong 🏓');
});
// get all users
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find();
    const ret = yield (0, retUsers_1.retUsers)(users);
    res.json(ret);
}));
// for login
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    res.setHeader('Content-Type', 'text/plain');
    const user = yield userModel_1.default.findOne({ username });
    if (!user)
        return res.json({ message: " user doesn't exist!" });
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid)
        res.json({ message: " Username or Password is incorrect" });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, `${process.env.SECRET}`);
    return res.json({ token, userId: user._id });
}));
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map