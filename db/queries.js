const db = require('./connection');

function queries(sql, tableName) {
    db.promise().query(sql)
        .then(response => {
            console.log("*************************************************************************");
            if (sql.toLowerCase().includes("select")) {
                console.table(response[0]);
            } else if (sql.toLowerCase().includes("insert")) {
                console.log(`Successfully added ${tableName} to the database`);
            }
            else if (sql.toLowerCase().includes("update")) {
                console.log(`Successfully updated ${tableName} data table`);
            }
            else if (sql.toLowerCase().includes("delete")) {
                console.log(`Successfully deleted row from ${tableName} data table`);
            }
            console.log("*************************************************************************");
        }).catch(e => console.log(e));
};

module.exports = queries;