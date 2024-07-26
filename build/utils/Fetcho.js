"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const enums_1 = require("../enums");
const fetcho = ({ url, method = enums_1.HttpMethod.GET, body, token, headers = {}, }) => {
    const urlObj = new URL(url);
    const defaultHeaders = Object.assign({ "Content-Type": "application/json" }, (token ? { Authorization: `Bearer ${token}` } : {}));
    const requestOptions = {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: Object.assign(Object.assign({}, defaultHeaders), headers),
    };
    return new Promise((resolve, reject) => {
        const req = https_1.default
            .request(requestOptions, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                if (data === "") {
                    reject(new Error("Empty response from server"));
                    return;
                }
                try {
                    const parsedData = JSON.parse(data);
                    if (!res.statusCode)
                        return;
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        reject(new Error(`Server error with status code ${res.statusCode}`));
                        return;
                    }
                    resolve(parsedData);
                }
                catch (error) {
                    reject(new Error(`Error parsing response: ${error}`));
                }
            });
        })
            .on("error", (error) => {
            console.log(url);
            reject(error);
        });
        if (body &&
            (method === enums_1.HttpMethod.POST ||
                method === enums_1.HttpMethod.PUT ||
                method === enums_1.HttpMethod.PATCH)) {
            if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
                req.write(body);
            }
            else {
                req.write(JSON.stringify(body));
            }
        }
        req.end();
    });
};
exports.default = fetcho;
