
const contable = require('console.table');

const Menu = require('./lib/menu');
const db_emp = require('./models/db_emp');
const db = require('./config/connection');

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
    /*{ ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "View all employees by manager",
        execute() {
            db_emp.fetchAllManagers((res) => this.execute_cb(res) );
        },
        execute_cb(res) {
            // build list
            var list = [];

            res.forEach( manager => {
                list.push( 
                    {
                        msg: manager.first_name +" "+ manager.last_name,
                        execute() { 
                            db_emp.fetchAllEmployeesByManagerID(manager.id,
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

            // show dept select list
            Menu.list(list);
        }
    },*/
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
                                                            {manager_id: manager.id}
                                                        );
                                                        Menu.list(mainList); 
                                                    }// no need for callback
                                                }
                                            );
                                        });

                                        // add no option and show list
                                        managerList.push({ msg: "None", execute() { Menu.list(mainList) } });
                                        Menu.list(managerList);
                                    })
                                }
                            }
                        );
                    });

                    // add no option and show list
                    roleList.push({ msg: "None", execute() { Menu.list(mainList) } });
                    Menu.list(roleList);
                });
            }); 
            
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Remove employee", 
        execute() {
            db_emp.fetchAllEmployees(null, (res) => this.execute_cb(res))
        },
        execute_cb(res) {
            var list = [];

            res.forEach( employee => {
                list.push(
                    {
                        msg: employee.first_name +" "+ employee.last_name,
                        execute() {
                            db_emp.removeEmployee(employee.id);
                            console.table(res); 
                            Menu.list(mainList); 
                        } // no need for callback
                    }
                );
            });

            // add no option and show list
            list.push({ msg: "Nevermind, I love all my employees", execute() { Menu.list(mainList) } });
            Menu.list(list);
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Update employee role", 
        execute() {
            db_emp.fetchAllEmployees( null, (res) => this.execute_cb(res) );
        },
        execute_cb(res) {
            var empID = null;

            // build employee list to select
            var empList = [];
            res.forEach( employee => {
                empList.push(
                    {
                        msg: employee.first_name + " " + employee.last_name,
                        execute() {
                            empID = employee.id; // update higher up var

                            db_emp.fetchAllRoles( (res) => this.execute_cb(res) );
                        },
                        execute_cb(res) {
                            // build list with roles to select
                            var roleList = [];
                
                            res.forEach( role => {
                                roleList.push( 
                                    {
                                        msg: role.title,
                                        execute() { 
                                            db_emp.updateEmployee(empID, {role_id: role.id})
                                            Menu.list(mainList);
                                        } // no need for callback
                                    }
                                )
                            });
            
                            // add no option and show list
                            roleList.push({ msg: "Nevermind", execute() { Menu.list(mainList) } });
                            Menu.list(roleList);
                        }
                    }
                );
            });

            // add no option and show list
            empList.push({ msg: "Nevermind", execute() { Menu.list(mainList) } });
            Menu.list(empList);
        } 
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Update employee manager", 
        execute() {
            db_emp.fetchAllEmployees( null, (res) => this.execute_cb(res) );
        },
        execute_cb(res) {
            var empID = null;

            // build employee list to select
            var empList = [];
            res.forEach( employee => {
                empList.push(
                    {
                        msg: employee.first_name + " " + employee.last_name,
                        execute() {
                            empID = employee.id; // update higher up var

                            db_emp.fetchAllEmployees( null, (res) => this.execute_cb(res) );
                        },
                        execute_cb(res) {
                            // build list with roles to select
                            var manList = [];
                
                            res.forEach( man => {
                                manList.push( 
                                    {
                                        msg: man.first_name + " " + man.last_name,
                                        execute() { 
                                            db_emp.updateEmployee(empID, {manager_id: man.id})
                                            Menu.list(mainList);
                                        } // no need for callback
                                    }
                                )
                            });
            
                            // add no option and show list
                            manList.push({ msg: "Nevermind", execute() { Menu.list(mainList) } });
                            Menu.list(manList, "Select employee's new manager:");
                        }
                    }
                );
            });

            // add no option and show list
            empList.push({ msg: "Nevermind", execute() { Menu.list(mainList) } });
            Menu.list(empList, "Select employee to change:");
        } 
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "View all roles", 
        execute() {  
            db_emp.fetchAllRoles( (res) => this.execute_cb(res) );
        },
        execute_cb(res) {
            console.table(res);
            Menu.list(mainList);
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Add role", 
        execute() {  
            Menu.input( 
                [
                    { name: "name", message: "Enter new role name:" },
                    { name: "salary", message: "Enter role's salary:" }
                ], 
                (res) => this.execute_cb(res));
        },
        execute_cb(res) {
            
            var addName = res.name;
            var addSalary = res.salary;

            db_emp.fetchAllDepts( res => {
                // build list
                var deptList = [];
                    
                res.forEach( dept => {
                    deptList.push( 
                        {
                            msg: dept.name,
                            execute() { 
                                db_emp.addRole(addName, addSalary, dept.id);
                                Menu.list(mainList);
                            }
                        }
                    )
                });

                // add no option and show list
                deptList.push({ msg: "Nevermind", execute() { Menu.list(mainList) } });
                Menu.list(deptList, "Select role's department:");
            });
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Remove role", 
        execute() {  
            db_emp.fetchAllRoles( (res) => this.execute_cb(res) );
        },
        execute_cb(res) {
            // build list with roles to select
            var roleList = [];
                
            res.forEach( role => {
                roleList.push( 
                    {
                        msg: role.title,
                        execute() { 
                            db_emp.removeRole(role.id);
                            Menu.list(mainList);
                        } // no need for callback
                    }
                )
            });

            // add no option and show list
            roleList.push({ msg: "Nevermind", execute() { Menu.list(mainList) } });
            Menu.list(roleList);
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "View all departments", 
        execute() {  
            db_emp.fetchAllDepts( (res) => this.execute_cb(res) );
        },
        execute_cb(res) {
            console.table(res);
            Menu.list(mainList);
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Add department", 
        execute() {  
            Menu.input( 
                [
                    { name: "name", message: "Enter new department name:" }
                ], 
                (res) => this.execute_cb(res));
        },
        execute_cb(res) {
            db_emp.addDepartment(res.name);
            Menu.list(mainList);
        }
    },
    { ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        msg: "Remove department",
        execute() {  
            db_emp.fetchAllDepts( (res) => this.execute_cb(res) );
        },
        execute_cb(res) {
            // build list with roles to select
            var deptList = [];
            
            res.forEach( dept => {
                deptList.push( 
                    {
                        msg: dept.name,
                        execute() { 
                            db_emp.removeDepartment(dept.id);
                            Menu.list(mainList);
                        } // no need for callback
                    }
                )
            });

            // add no option and show list
            deptList.push({ msg: "Nevermind", execute() { Menu.list(mainList) } });
            Menu.list(deptList);
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
