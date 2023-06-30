const { Pool } = require('pg');
const { pgSqlConfig, USER_MESSAGE } = require('../config/app.config');
const executeQuery = async () => {
    const pool = new Pool(pgSqlConfig)
    const cdcQuery1 = 'with \n' +
        '         dt as\n' +
        '         (\n' +
        '         select n, (current_date -n)  baldt  from generate_series(1,2) s(n) \n' +
        '         ),\n' +
        '         gstDet as\n' +
        '         (select * from\n' +
        '             (select n, baldt,\n' +
        '             gst."SOL_ID",\n' +
        '             "BAL_DATE" TRAN_DATE, "END_BAL_DATE" END_TRAN_DATE,\n' +
        '                 (case  when "GL_SUB_HEAD_CODE" between \'25001\'and \'25999\'\n' +
        '                     then  \'D-SB\'\n' +
        '                     when "GL_SUB_HEAD_CODE" = \'20002\'\n' +
        '                     then  \'D-ODD\'\n' +
        '                     when (("GL_SUB_HEAD_CODE" between \'20001\' and \'20099\') and "GL_SUB_HEAD_CODE" != \'20002\')\n' +
        '                     then  \'D-CA\'\n' +
        '                     when "GL_SUB_HEAD_CODE" between \'15001\' and \'15999\'\n' +
        '                     then  \'D-TD\'\n' +
        '                     when "GL_SUB_HEAD_CODE" between \'30001\' and \'30099\'\n' +
        '                     then  \'D-TD\'\n' +
        '                     when "GL_SUB_HEAD_CODE" between \'69001\' and \'70999\'\n' +
        '                     then  \'ADV\'\n' +
        '                     else  \'Others\'\n' +
        '                 end)  type1,\n' +
        '                 "GL_SUB_HEAD_CODE" gl_sub_head_code, "CRNCY_CODE" , ("TOT_CR_BAL" - "TOT_DR_BAL") O_crncy_bal,\n' +
        '                 max("BAL_DATE") over wnd "MAX_TRAN_DATE",\n' +
        '                 min("END_BAL_DATE") over wnd "Min_EOD_TRAN_DATE"		\n' +
        '                 from "TBAADM"."GL_SUB_HEAD_TRAN_TABLE" gst,\n' +
        '                 dt\n' +
        '                 where  \n' +
        '         		 "END_BAL_DATE" >= baldt\n' +
        '                 and "BAL_DATE" <= baldt\n' +
        '                 window wnd  AS(\n' +
        '         					PARTITION BY \n' +
        '         					n, baldt, "SOL_ID", "GL_SUB_HEAD_CODE" , "CRNCY_CODE"  ORDER BY "BAL_DATE"\n' +
        '         					ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\n' +
        '         				)		\n' +
        '             )g where \n' +
        '             --type1!= \'Others\' and\n' +
        '             TRAN_DATE = "MAX_TRAN_DATE"\n' +
        '             and END_TRAN_DATE = "Min_EOD_TRAN_DATE"\n' +
        '         	and O_crncy_bal != 0\n' +
        '         ),\n' +
        '         nor as\n' +
        '         (select * from\n' +
        '                 (select baldt, "FXD_CRNCY_CODE", "VAR_CRNCY_UNITS"/"FXD_CRNCY_UNITS" "NORate" , "LCHG_TIME" lchg_time,\n' +
        '                                 max("LCHG_TIME") over (partition by baldt, "FXD_CRNCY_CODE") max_lchg_time\n' +
        '                                                         from "TBAADM"."RATELIST_HIST_TABLE" rth, dt\n' +
        '                                                         where rth."RTLIST_DATE"  = (select max("RTLIST_DATE") from "TBAADM"."RATELIST_HIST_TABLE"\n' +
        '                                                                                         where "RTLIST_DATE" <= baldt\n' +
        '                                                                                                 and "VAR_CRNCY_CODE" = \'INR\'\n' +
        '                                                                                                 and "RATECODE" = \'NOR\'\n' +
        '                                                                                                 and "DEL_FLG" != \'Y\' )\n' +
        '                                                         and "FXD_CRNCY_CODE" in (SELECT DISTINCT "CRNCY_CODE" FROM gstDet WHERE  "CRNCY_CODE"!=\'INR\')\n' +
        '                                                         and "VAR_CRNCY_CODE" = \'INR\'\n' +
        '                                                         and "RATECODE" = \'NOR\'\n' +
        '                                                         and "DEL_FLG" != \'Y\'\n' +
        '                 ) n where lchg_time = max_lchg_time\n' +
        '         ),\n' +
        '         tot as\n' +
        '         (select n, baldt, "Typ", type1,sum(O_crncy_bal * "NOR_val") val\n' +
        '             from \n' +
        '             (select  n, baldt, substr(type1,1,1) "Typ",type1, O_crncy_bal,\n' +
        '             			(case when "CRNCY_CODE" = \'INR\' then 1 else  COALESCE((select  "NORate"  from nor where baldt = gstDet.baldt  and "FXD_CRNCY_CODE" = "CRNCY_CODE"),1) end ) "NOR_val"\n' +
        '                 from gstDet\n' +
        '             ) v\n' +
        '             group by n, baldt,type1,"Typ",O_crncy_bal,"NOR_val"\n' +
        '         )    \n' +
        '         SELECT\n' +
        '         json_build_object(\n' +
        '         \'DATE\',(select to_char(baldt,\'DD-mm-YY\') from dt where n=1),\n' +
        '         \'SB\' , to_char(sb_amt,\'99999.99\')||\'(\'||to_char(psb_amt,\'99999.99\')||\')\', \n' +
        '         \'CA\' , to_char(ca_amt,\'9999.99\')||\'(\'||to_char(pca_amt,\'9999.99\')||\')\',\n' +
        '         \'ODD\', to_char(odd_amt,\'9999.99\')||\'(\'||to_char(podd_amt,\'9999.99\')||\')\',\n' +
        '         \'Dep\', to_char(tot_dep,\'99999.99\')||\'(\'||to_char(pdt_tot_dep,\'99999.99\')||\')\',\n' +
        '         \'Adv\', to_char(abs(tot_adv),\'99999.99\')||\'(\'||to_char(abs(pdt_tot_adv),\'99999.99\')||\')\',\n' +
        '         \'RTL Dep\', \'0 (0)\',\n' +
        '		 \'GTOT\',(select sum(val) from tot)\n' +
        '         )n\n' +
        '          from\n' +
        '          (  select * from\n' +
        '         	 (select  \n' +
        '         		 (select sum(val)/10000000 from tot where type1 = \'D-SB\' /*and baldt = (current_date -n) */    and n=1) sb_amt,\n' +
        '         		 (select sum(val)/10000000 from tot where type1 = \'D-SB\' /*and baldt = (current_date -n) */    and n=2) psb_amt,\n' +
        '         		 (select sum(val)/10000000 from tot where type1 = \'D-CA\' /*and baldt = (current_date -n) */    and n=1) ca_amt,\n' +
        '         		 (select sum(val)/10000000 from tot where type1 = \'D-CA\' /*and baldt = (current_date -n) */    and n=2) pca_amt,\n' +
        '         		 (select sum(val)/10000000 from tot where type1 = \'D-ODD\' /*and baldt = (current_date -n) */     and n=1) odd_amt,\n' +
        '         		 (select sum(val)/10000000 from tot where type1 = \'D-ODD\' /*and baldt = (current_date -n) */     and n=2) podd_amt,\n' +
        '         		 (select sum(val)/10000000 from tot where "Typ" =\'D\' /*and baldt = (current_date -n) */ and n=1) tot_dep,\n' +
        '         		 (select sum(val)/10000000 from tot where "Typ" =\'D\' /*and baldt = (current_date -n) */ and n=2) pdt_tot_dep,\n' +
        '         		 (select sum(val)/10000000 from tot where type1 = \'ADV\' /*and baldt = (current_date -n) */     and n=1) tot_adv,\n' +
        '         		 (select sum(val)/10000000 from tot where type1 = \'ADV\' /*and baldt = (current_date -n)  */    and n=2) pdt_tot_adv  \n' +
        '         	 ) t\n' +
        '          ) t1'

    console.log('starting async query')
    try {
        const startTime = performance.now();
        const result = await pool.query(cdcQuery1)
        const endTime = performance.now();
        const sec = (startTime - endTime) / 1000
        const elapsed = Math.floor(sec / 60)
        console.log(`Query took${elapsed} minutes`)
        console.log('async query finished')
        var queryCompleted = true
        console.log(result.rows[0].n)
        return result.rows[0].n
    } catch (error) {
        console.log(error)
    }
    // } else { 
    //     console.log(`${USER_MESSAGE.FLAG_FAILURE}`)
    // }

    if (queryCompleted) {
        console.log('calling end')
        await pool.end()
        console.log('pool has drained')
    }


}
// executeQuery()
module.exports = executeQuery;