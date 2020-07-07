
// requires
const mysql = require('mysql');
const util = require('util');

/** UDB
 * Universal database class that handles async query functions
 * 
 */
class UDB
{
    constructor(_user, _pass, _db, _host = 'localhost', _port = 3306)
    {
        // error handling
        if (typeof _user != 'string' || _user.length == 0
            || typeof _pass != 'string' || _pass.length == 0
            || typeof _db != 'string' || _db.length == 0
            || typeof _host != 'string' || _host.length == 0
            || typeof _port != 'number'
        ) {
            throw "User, pass, db, and host must all be non-empty "+
                "strings and port must be a number.";
        }

        // create connection
        this.con = mysql.createConnection(
            {
                host: _host,
                port: _port,
                user: _user,
                password: _pass,
                database: _db
            }
        );
    }

    _query(sql, args)
    {
        if (!sql.length)
            throw "Invalid SQL query";

        return util
            .promisify(this.con.query)
            .call(this.con, sql, args);
    }

    _close() 
    {
        return util
            .promisify(this.con.end)
            .call(this.con);
    }

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
}

module.exports = UDB;