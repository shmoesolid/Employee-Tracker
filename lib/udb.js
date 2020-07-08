
// requires
const mysql = require('mysql');
const util = require('util');

/** UDB
 * Universal database class that handles async query functions
 * 
 */
class UDB
{
    /** constructor
     * 
     * @param {string} _user 
     * @param {string} _pass 
     * @param {string} _db 
     * @param {string} _host 
     * @param {number} _port 
     */
    constructor(_user, _pass, _db, _host = 'localhost', _port = 3306)
    {
        // error handling
        if (typeof _user != 'string' 
            || typeof _pass != 'string' 
            || typeof _db != 'string' 
            || typeof _host != 'string' 
            || typeof _port != 'number'
            || !_user.length || !_pass.length || !_db.length || !_host.length
            || _port < 0 || _port > 65535
        ) {
            throw "User, pass, db, and host must all be non-empty "+
                "strings and port must be a number in range from 0 to 65535.";
        }

        // set vars
        this.db = _db;
        this.host = host;
        this.port = _port;
        this.user = _user;
        this.pass = _pass;

        // set connection
        this.setConnection(this.db)

        // not running query
        this.runningQuery = false;
    }

    /** setConnection
     * 
     * @param {string} _db 
     * @param {string} _host 
     * @param {number} _port 
     * @param {string} _user 
     * @param {string} _pass 
     */
    setConnection(_db, 
        _host = this.host, 
        _port = this.port, 
        _user = this.user, 
        _pass = this.pass
    ) {
        this.con = mysql.createConnection(
            {
                database: _db,
                host: _host,
                port: _port,
                user: _user,
                password: _pass
            }
        );
    }

    /** unsetConnection
     * 
     */
    unsetConnection()
    {
        this.con.end();
        this.con = null; // just making sure
    }

    /** _query
     * 
     * @param {string} sql 
     * @param {array} args 
     */
    _query(sql, args)
    {
        if (!sql.length)
            throw "Invalid SQL query";

        return util
            .promisify(this.con.query)
            .call(this.con, sql, args);
    }

    /** _close
     * 
     */
    _close() 
    {
        return util
            .promisify(this.con.end)
            .call(this.con);
    }

    /** test
     * DEBUG
     */
    async test()
    {
        var rows = null;

        try
        {
            rows = await this._query( 'SELECT * FROM ??', 'employee' );
        }
        catch(err)
        {
            console.log(err);
            process.exit(1);
        }
        finally
        {
            await this._close();
            return rows;
        }
    }
    
    /** fetch
     * usage:
     * 	fetch( 'table1', ['col1', 'col2', 'col3'], [{key1: value1}, {key2: value2}], ['=', '!~'] );
     * 	fetch( 'table2', ['*'], [{key1: value1}], ['>='] );
     *
     *  posstibles with logical operators:
     *
     * 	fetch( 'table1', ['*'], [{key1: value1}, "&&", {key2: value2}], ['=', '!~'] );
     *  fetch( 'table2', 
     *  	['col1', 'col2'],
     *  	[
     *  		{key1: value1}, "&&", 
     *  		{key2: value2}, "||",
     *  		{k3: v3}, "||",
     *  		{k4: v4}
     *  	],
     *  	['=', '!=', '~', '>']
     *  );
     *
     *  or ...
     *
     *  fetch( 'table1', ['*'],
     *  	UDB.Group(
     *  		UDB.Where("key1", "=", "value1"),
     *  		UDB.Logical("&&"),
     *  		UDB.Where("key2", "!=", "value2")
     *  	),
     *  	UDB.Logical("||"),
     *  	UDB.Where("key3", "~", "value3")
     *  );
     *  
     * 	
     *
     *
     * 	TODO find a place for AND and OR between where statements
     */
    async fetch( // setup column array, where array, operator array, limit array, order string, direction = "ASC"
	tableName,
        colArray = [], 
        whereArray = [], 
        operators = []
    ) {
	// general validations
	if (!tableName.length) throw "Must enter a table name";
	if (!colArray.length) throw "No columns to fetch from";
	if (!whereArray.length || !operators.length) throw "No where array or operators";
	//if (whereArray.length != operators.length) throw "Each where element must have a matching operator";
	
	// update connection table
	this.setConnection(tableName);
	    
        // ensure using valid operator(s)
        const validOperator = ['=','!=','>','<','>=','<=','~','!~'];
        operators.forEach(
            operator => {
                if (validOperator.indexOf(operator) == -1) 
		    throw "Invalid operator";
            }
        );
	
	// establish param array
	var params = [];

	// build column string
	var colString = "";
	for (var i = 0; i < colArray.length; i++)
	{
	    colString += "??";
	    if ((i+1) <  colArray.length) colString += ",";
	}

	// build where string
	var whereString = "";
	for (var i = 0; i < whereArray.length; i++)
	{
	    let curKey = Object.keys(whereArray[i])[0];
	    whereString += curKey + " = ?";
	    if ((i+1) < whereArray.length) whereString += " AND "; // TODO confirm
	}

	// add col and where params
	params = params.concat(colArray);
	var whereParams = whereArray.map(obj => Object.values(obj)[0]);
	params = params.concat(whereParams);

	
    }
    
}

module.exports = UDB;
