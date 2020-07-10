
const contable = require('console.table');
const UDB = require("./lib/udb");

const db = new UDB("root", "HERRO_PASSWORD", "employee_db");

// db
//     .queryRaw('SELECT ?? FROM ?? WHERE first_name = ?',
//         [
//             "*", "employee", "name"
//         ]
//     ).then( rows => console.table(rows) );

db
    .fetch('employee', ['*'], {id: 1}, ['='], null, 'last_name')
    .then( rows => console.table(rows) );

// db
//     .fetch('employee', ['*'])
//     .then( rows => console.table(rows) );

// db
// .insert('employee', {first_name: "Shane", last_name: "Brosif"})
// .then(
//     db
//     .fetch('employee', ['*'], null, null, [10,0])
//     .then( rows => 
//         {
//             console.table(rows);
//             db.close();
//         }
//     )
// );

// db
// .delete('employee', {id: 2}, ['='])
// .then(
//     db
//     .fetch('employee', ['*'], null, null, [10,0])
//     .then( rows => 
//         {
//             console.table(rows);
//             db.close();
//         }
//     )
// );

// db
// .update('employee', {first_name: 'Chaine'}, {id: 3}, ['='])
// .then(
//     db
//     .fetch('employee', ['*'], null, null, [10,0])
//     .then( rows => 
//         {
//             console.table(rows);
//             db.close();
//         }
//     )
// );

