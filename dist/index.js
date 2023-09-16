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
exports.check = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("./Models/userModel"));
const retUsers_1 = require("./outils/retUsers");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const check = (req) => {
    const { password, confirm, username, email } = req.body;
    const passhashed = bcrypt_1.default.hashSync(password, 10);
    return password === confirm ? { username, email, password: passhashed } : null;
};
exports.check = check;
const app = (0, express_1.default)();
const port = 5000;
app.use(express_1.default.json());
dotenv_1.default.config();
mongoose_1.default.connect(`mongodb+srv://mhaddaou:iQ8Ij9h9GgfBNZeC@cluster0.baz83mq.mongodb.net/mern?retryWrites=true&w=majority`).then(() => {
    console.log('db connection established');
}).catch((err) => {
    console.log('db connection error ', err);
});
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
// to register new user
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, exports.check)(req);
    res.setHeader('Content-Type', 'text/plain');
    const username = req.body.username;
    const exist = yield userModel_1.default.findOne({ username });
    if (exist)
        return res.status(421).json({ message: "username alredy exist" });
    if (!user)
        return res.status(422).json({ message: "the password is not same" });
    const newUser = new userModel_1.default(user);
    yield newUser.save();
    res.json({ message: "user created successfully" });
}));
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
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map