const { Client } = require("pg")
const { Pool } = require('pg');
const { pgSqlConfig } = require("../config/app.config");


const pgSqlConX = () => {
    const client = new Client(pgSqlConfig)
    try {
        client.connect((err) => {
            if (err) throw err;
            console.log("KBL Data Lake Connected!");
        });
        
    } catch (error) {
        console.log("KBL Data Lake Connection Failure!");
    }
   
}

module.exports = pgSqlConX;