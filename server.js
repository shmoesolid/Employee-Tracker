
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

// db
//     .fetch('employee', ['*'], {id: 1}, ['='], null, 'last_name')
//     .then( rows => console.table(rows) );

// db
//     .fetch('employee', ['*'])
//     .then( rows => console.table(rows) );

db
    .fetch('employee', ['*'], null, null, [10,0])
    .then( rows => console.table(rows) );

//db.parseForParams('SELECT  *  FROM blah WHERE x = 1;');

