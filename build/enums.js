"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = exports.Constants = exports.URLS = exports.Routes = void 0;
const constants_1 = require("./constants");
var Routes;
(function (Routes) {
    Routes["MAIN"] = "/";
    Routes["AUTH"] = "/auth";
    Routes["PROFILE"] = "/profile";
    Routes["MESSAGES"] = "/messages";
    Routes["CONTACTS"] = "/contacts";
    Routes["STATUS"] = "/status";
    Routes["GROUPS"] = "/groups";
})(Routes || (exports.Routes = Routes = {}));
exports.URLS = {
    MAIN: constants_1.BASE_URL,
    ACTIVATE_USER: `${constants_1.BASE_URL}/auth/activateUser`,
};
var Constants;
(function (Constants) {
    Constants["ERROR"] = "error";
})(Constants || (exports.Constants = Constants = {}));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
