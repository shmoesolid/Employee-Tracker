
const contable = require('console.table');
const UDB = require("./lib/udb");

const db = new UDB("root", "HERRO_PASSWORD", "employee_db");

db.test().then( 
    rows => console.table(rows)
);

