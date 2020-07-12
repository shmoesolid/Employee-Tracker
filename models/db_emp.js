
var db = require("../config/connection.js");

var db_emp = 
{
    /**
     * 
     * @param {object} byObj // ie: { column: value } // only handles 1 property/value
     */
    fetchAllEmployees: function(byObj = null, cb=null)
    {
        // build sql string
        var queryString = 'SELECT'
            +' e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary,'
            +' CONCAT(e2.first_name, " ", e2.last_name) AS manager'
            +' FROM employee e'
            +' LEFT JOIN role r ON ?? = ??'
            +' LEFT JOIN department d ON ?? = ??'
            +' LEFT JOIN employee e2 ON ?? = ??'
            + ((byObj != null) ? ` WHERE ${Object.keys(byObj)[0]} = ?` : "");

        // build argument array
        var argArray = [ 'e.role_id', 'r.id', 'r.department_id', 'd.id', 'e.manager_id', 'e2.id' ];

        // add any extra
        if (byObj != null) 
            argArray.push(byObj[ Object.keys(byObj)[0] ]);

        // run query
        db
        .queryRaw(queryString, argArray)
        .then( function(res) { if (cb!=null) cb(res) } );
    },

    fetchAllEmployeesByDeptName: function(whichDept, cb=null)
    {
        this.fetchAllEmployees( {'d.name':whichDept}, function(res) { cb(res) } );
    },

    fetchAllManagers: function(cb=null)
    {
        db
        .queryRaw('SELECT DISTINCT * FROM employee WHERE manager_id != ?', ['null'])
        .then( function(res) { if (cb!=null) cb(res) } );
    },

    fetchAllRoles: function(cb=null)
    {
        db
        .fetch('role', ['*'])
        .then( function(res) { if (cb!=null) cb(res) });
    },

    fetchAllDepts: function(cb=null)
    {
        db
        .fetch('department', ['name'])
        .then( function(res) { if (cb!=null) cb(res) });
    },

    addEmployee: function(first, last, cb=null)
    {
        db
        .insert('employee', {first_name: first, last_name: last})
        .then( function(res) { if (cb!=null) cb(res) });
    },

    updateEmployee: function(id, what = {}, cb=null)
    {
        db
        .update('employee', what, {"id": id}, ['='])
        .then( function(res) { if (cb!=null) cb(res) });
    },

    removeEmployee: function(id, cb=null)
    {
        db
        .delete('employee', {id: id}, ["="])
        .then( function(res) { if (cb!=null) cb(res) });
    },

    close: function()
    {
        db.close();
    }
}

module.exports = db_emp;
