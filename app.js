
const contable = require('console.table');

const Menu = require('./lib/menu');
const db_emp = require('./models/db_emp');

var mainList =
[
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "View all employees", 
        execute() { 
            db_emp.fetchAllEmployees( null, (res) => this.execute_cb(res) ) ;
        },
        execute_cb(res) {
            console.table(res); 
            Menu.list(mainList); 
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "View all employees by department",
        execute() {
            db_emp.fetchAllDepts((res) => this.execute_cb(res) );
        },
        execute_cb(res) {
            // build list with depts to select
            var deptList = [];

            res.forEach( dept => {
                deptList.push( 
                    {
                        msg: dept.name,
                        execute() { 
                            db_emp.fetchAllEmployeesByDeptName(dept.name, (res) => this.execute_cb(res)) 
                        },
                        execute_cb(res) {
                            console.table(res); 
                            Menu.list(mainList); 
                        }
                    }
                );
            });

            // show dept select list
            Menu.list(deptList);
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Add employee",
        execute() { 
            Menu.input(
                [
                    {
                        name: "first",
                        msg: "Employee first name:",
                    },
                    {
                        name: "last",
                        msg: "Employee last name:",
                    }
                ]
            , (res) => this.execute_cb(res));
        },
        execute_cb(res) {
            db_emp.addEmployee(res.first, res.last, (res) => {
                var empID = res.insertId;

                db_emp.fetchAllRoles( (res) => {
                    // build list with roles to select
                    var roleList = [];

                    res.forEach( role => {
                        roleList.push( 
                            {
                                msg: role.title,
                                execute() { 
                                    console.log(empID, role.id);
                                    db_emp.updateEmployee(empID, {role_id: role.id}, (res) => this.execute_cb(res))
                                },
                                execute_cb(res) {
                                    db_emp.fetchAllEmployees(null, res => {
                                        var managerList = [];

                                        res.forEach( manager => {
                                            managerList.push(
                                                {
                                                    msg: manager.first_name +" "+ manager.last_name,
                                                    execute() {
                                                        db_emp.updateEmployee(
                                                            empID, 
                                                            {manager_id: manager.id},
                                                            (res) => this.execute_cb(res)
                                                        );
                                                    },
                                                    execute_cb(res) {
                                                        console.table(res); 
                                                        Menu.list(mainList); 
                                                    }
                                                }
                                            );
                                        });

                                        // add no option
                                        managerList.push({ msg: "None", execute() { Menu.list(mainList) } });

                                        Menu.list(managerList);
                                    })
                                }
                            }
                        );
                    });

                    // add no option
                    roleList.push({ msg: "None", execute() { Menu.list(mainList) } });

                    // show rolelist selection
                    Menu.list(roleList);
                });
            }); 
            
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Remove employee", 
        execute() {
            db_emp.fetchAllEmployees(null, res => {
                var list = [];

                res.forEach( employee => {
                    list.push(
                        {
                            msg: employee.first_name +" "+ employee.last_name,
                            execute() {
                                db_emp.removeEmployee(employee.id);
                                console.table(res); 
                                Menu.list(mainList); 
                            }
                        }
                    );
                });

                // add no option
                list.push({ msg: "Nevermind, I love all my employees", execute() { Menu.list(mainList) } });

                // show list
                Menu.list(list);
            }
        )},
        execute_cb(res) {
            
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Update employee role", 
        execute() {  

        },
        execute_cb(res) {
            
        } 
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Update employee manager", 
        execute() {  

        },
        execute_cb(res) {
            
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "View all roles", 
        execute() {  

        },
        execute_cb(res) {
            
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Add role", 
        execute() {  

        },
        execute_cb(res) {
            
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Remove role", 
        execute() {  

        },
        execute_cb(res) {
            
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Add department", 
        execute() {  

        },
        execute_cb(res) {
            
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Remove department",
        execute() {  

        },
        execute_cb(res) {
            
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Exit",
        execute() {  
            db_emp.close(); 
            process.exit();
        }
    }
];

console.log("\n",
    "================================\n",
    "= Employee Tracker...\n",
    "================================\n");
Menu.list(mainList);
