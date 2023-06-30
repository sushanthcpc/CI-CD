const { Pool } = require('pg');
const { pgSqlConfig, USER_MESSAGE } = require('../config/app.config');
const pool = new Pool(pgSqlConfig)

const queryFlag_Generator = async () => {
    const flagQuery = 'select "DB_STAT_DATE","DC_CLS_DATE", "DC_RESTARTABILITY_FLG", "DC_STAT_CODE", (case when("DB_STAT_DATE" = current_date and "DC_STAT_CODE" = \'Y\') then 1 else 0 END) Ready2go from "TBAADM"."SOL_GROUP_CONTROL_TABLE" '
    console.log(USER_MESSAGE.FLAG_STARTED)
    try {
        const resultFlag = await pool.query(flagQuery)
        const flagToCron = resultFlag.rows[0].ready2go
        return flagToCron
    } catch (error) {
        console.log(error)
    }
    console.log(USER_MESSAGE.FLAG_SUCCESS)
}

const cdcQuery_Generator = () => {

}

module.exports = { queryFlag_Generator, cdcQuery_Generator }