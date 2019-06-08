"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
(() => __awaiter(this, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    let files = [];
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
    // Sending response to prevent 4xx errors on root URL
    app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send("try /filteredimage?image_url={{URL}}");
    }));
    // Filters and returns the requested image
    app.get("/filteredimage", (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { image_url } = req.query;
        if (!image_url)
            return res.status(400).send({ message: 'Image url is required' });
        util_1.deleteLocalFiles(files);
        let result = yield util_1.filterImageFromURL(image_url);
        if (!result)
            return res.status(422).send({ message: 'Unable to process image due to semantic errors.' });
        files.push(result);
        res.status(200).sendFile(result);
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map