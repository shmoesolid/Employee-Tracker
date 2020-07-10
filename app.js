
const inquirer = require('inquirer');
const contable = require('console.table');
const UDB = require("./lib/udb");

const db = new UDB("root", "HERRO_PASSWORD", "employee_db");

console.log("================================\n\n");

var mainMenuChoices = Object.freeze(
	{
		viewEmp: "View all employees", // presetMethod()] // maybe this??
  		addEmp: "Add a new employee",
  		updateEmp: "Edit an employee",
  		deleteEmp: "Delete an employee",
		exit: "Exit",
	}
  	/*
    [
    	{ msg: "View all employees", execute: () => { db.fetch(); } },
        { msg: "Add a new employee", execute: () => { submenuBlah() } }
    ]
    */
);

var mainMenu = () =>
{
    inquirer
        .prompt(
            {
                name: "something",
                type: "list",
                message: "message: ",
                choices: Object.values(mainMenuChoices)
            }
        ).then( answer =>
            // ..
            // anwser.something
            switch (answer.something)
  			{
            	case mainMenuChoices.viewEmp:
              		// execute query or run sub menu
            }
        );
};

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