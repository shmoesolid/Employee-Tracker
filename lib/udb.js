
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

    async fetch( // setup column array, where array, operator array, limit array, order string, direction = "ASC"
        colArray = [], 
        whereArray = [], 
        operators = []
    ) {
        // handle valid operator(s)
        const validOperator = ['=','!=','>','<','>=','<=','~','!~'];
        operators.forEach(
            operator => {
                if (!validOperator.indexOf(operator)) throw "Invalid operator...";
            }
        );


    }
    
}

module.exports = UDB;