
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

        // set connection
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

    /** queryRaw
     * queries by raw sql statement with args
     * 
     * @param {string} sql 
     * @param {array} args 
     */
    async queryRaw(sql, args)
    {
        var rows = null;

        try
        {
            rows = await this._query( sql, args );
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
     * simply builds sql string by parameters allowed and runs query
     * 
     * usage:
     * 	fetch( 'table1', ['col1', 'col2', 'col3'], {key1: value1, key2: value2}, ['=', 'NOT LIKE'] );
     * 	fetch( 'table2', ['*'], {key1: value1}, ['>='] );
     * 
     * current only using AND for multiple where statements (TODO: add for OR as well)
     * 
     * @param {string} tableName 
     * @param {array} colArray 
     * @param {object} whereObj 
     * @param {array} operators 
     */
    async fetch( // setup column array, where array, operator array, limit array, order string, direction = "ASC"
	    tableName,
        colArray = [], 
        whereObj = {}, 
        operators = [],
        limitArray = [],
        orderBy = "",
        orderDir = "ASC"
    ) {
        // make some null corrections
        if (whereObj === null) whereObj = {};
        if (operators === null) operators = [];
        if (limitArray === null) limitArray = [];

        // separate now so not doing multiple times
        var whereKeys = Object.keys(whereObj);

        // general validations
        if (!tableName.length) throw "Must enter a table name";
        if (!colArray.length) throw "No columns to fetch from";
        if (whereKeys.length != operators.length) throw "Each where property must have a matching operator";
        if (limitArray && limitArray.length > 2) throw "Only allowed 2 in limit array (min and max)";
        if (orderBy.length && (orderDir != "ASC" && orderDir != "DESC")) throw "Order direction invalid";
	    
        // ensure using valid operator(s)
        const validOperator = ['=','!=','<>','>','<','>=','<=','LIKE','NOT LIKE'];
        operators.forEach(
            operator => 
            {
                if (validOperator.indexOf( operator.toUpperCase() ) == -1)
		            throw "Invalid operator";
            }
        );
	
        // build column string
        var colString = "";
        for (var i = 0; i < colArray.length; i++)
        {
            colString += "??";
            if (i < colArray.length-1) colString += ", ";
        }

        // build where string
        var whereString = "";
        var i = 0;
        whereKeys.forEach(
            key =>
            {
                whereString += key +" "+ operators[i] + " ?";
                if (i < whereKeys.length-1) whereString + " AND ";
                i++;
            }
        );

        // build limit string
        var limitString = "";
        for (var i = 0; i < limitArray.length; i++)
        {
            limitString += limitArray[i];
            if (i < limitArray.length-1) limitString += " OFFSET ";
        }

        // build sql string
        var sql = `SELECT ${colString} FROM ??`
            + `${((whereString.length)
                ? ` WHERE ${whereString}`
                : "")}`
            + `${((orderBy.length)
                ? ` ORDER BY ${orderBy} ${orderDir}`
                : "")}`
            + `${((limitString.length) 
                ? ` LIMIT ${limitString}`
                : "")}`;

        // build args array
        var args = colArray; // add cols
        args.push(tableName); // add table
        args = args.concat(Object.values(whereObj)); // add where values

        console.log(sql, args);
        
        // run query
        return await this.queryRaw(sql, args);
    }

    /** _query
     * private query method
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
}

module.exports = UDB; 
