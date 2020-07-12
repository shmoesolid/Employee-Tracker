
const UDB = require("../lib/udb");

const db = new UDB("root", "HERRO_PASSWORD", "employee_db");

module.exports = db;