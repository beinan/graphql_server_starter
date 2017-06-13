//This implementation is derived from "https://goenning.net/2016/05/13/how-i-manage-application-configuration-with-nodejs/"

const {merge} = require("lodash");
const defaults = require("./default.js");
const config = require("./" + (process.env.NODE_ENV || "development") + ".js");

module.exports = merge({}, defaults, config);
