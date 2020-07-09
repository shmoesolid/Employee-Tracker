
const contable = require('console.table');
const UDB = require("./lib/udb");

const db = new UDB("root", "HERRO_PASSWORD", "employee_db");

// db.test().then( 
//     rows => console.table(rows)
// );


// db
//     .queryRaw('SELECT ?? FROM ?? WHERE first_name = ?',
//         [
//             "*", "employee", "name"
//         ]
//     ).then( rows => console.table(rows) );

db
    .fetch('employee', ['*'], {last_name: "blow"}, ['='])
    .then( rows => console.table(rows) );

//db.parseForParams('SELECT  *  FROM blah WHERE x = 1;');

