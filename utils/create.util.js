const { Pool } = require('pg');
const { pgSqlConfig, USER_MESSAGE } = require('../config/app.config');
const pool = new Pool(pgSqlConfig)

const postDataDB = async (data) => {
    console.log('Data Posting')
    let { DATE, SB, CA, ODD, Dep, Adv } = data
    pool.query('INSERT INTO bfsd.bfsd (date, sb, ca, odd, dep, adv) VALUES ($1, $2, $3, $4, $5, $6)', [DATE, SB, CA, ODD, Dep, Adv], (error, results) => {
        if (error) {
            throw error  
        }
        return results
        //response.status(201).send(`BFSD_Record added for DATE: ${results.DATE}`)
    })
}


module.exports = postDataDB