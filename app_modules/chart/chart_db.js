const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../oradb/dbHandler')

const Query = `select
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_sbi
from productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'dd') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'FFB'`

const QueryDua = `select 
sum(case when x.month = extract(month from to_date(:p_date,'dd-mm-yyyy')) then (kg/hari) end)/1000 bgt_hi,
sum(case when x.month = extract(month from to_date(:p_date,'dd-mm-yyyy')) then (kg) end)/1000 bgt_bi,
sum(case when x.month <= extract(month from to_date(:p_date,'dd-mm-yyyy')) then (kg) end)/1000 bgt_sbi,
sum((kg))/1000 bgt_year
from EPMS_USTP.budgetcrop_consol_detail x, (select extract(year from tdate) year, extract(month from tdate) month, count(*) hari
from calendar where substr(to_char(tdate,'DAY'),1,3) not in ('SUN')
group by extract(year from tdate), extract(month from tdate)) y
where x.year = y.year
and x.month = y.month
and x.year = extract(year from to_date(:p_date,'dd-mm-yyyy'))`

const QueryTiga_Panen = `select 'Pct'description,  sum(hadir)/sum(actual) * 100
from
(
select count(*) actual, 0 hadir from EPMS_USTP.empganghistorydetail_consol where month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and hr_name = 'Panen'
union all
select 0, count(*) 
from
(
select x.site, x.empcode, x.tdate from EPMS_USTP.gangactivitydetail_consol x, EPMS_USTP.empganghistorydetail_consol  y 
where tdate = to_date(:p_date,'dd-mm-yyyy')
and month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and x.site = y.site
and x.empcode = y.empcode
and hr_name = 'Panen'
and attdcode in ('KJ','PH','KE','PE','DL')
group by x.site, x.empcode, x.tdate
)
)
union all
select 'MPP' description, 0 from dual
union all
select 'Aktual' description, count(*)  from EPMS_USTP.empganghistorydetail_consol where month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and hr_name = 'Panen'
union all
select 'Hadir' description, count(*) 
from
(
select x.site, x.empcode, x.tdate from EPMS_USTP.gangactivitydetail_consol x, EPMS_USTP.empganghistorydetail_consol  y 
where tdate = to_date(:p_date,'dd-mm-yyyy')
and month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and x.site = y.site
and x.empcode = y.empcode
and hr_name = 'Panen'
and attdcode in ('KJ','PH','KE','PE','DL')
group by x.site, x.empcode, x.tdate
)
`

const QueryTiga_Rawat = `select 'Pct'description,  sum(hadir)/sum(actual) * 100
from
(
select count(*) actual, 0 hadir from EPMS_USTP.empganghistorydetail_consol where month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and hr_name = 'Rawat'
union all
select 0, count(*) 
from
(
select x.site, x.empcode, x.tdate from EPMS_USTP.gangactivitydetail_consol x, EPMS_USTP.empganghistorydetail_consol  y 
where tdate = to_date(:p_date,'dd-mm-yyyy')
and month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and x.site = y.site
and x.empcode = y.empcode
and hr_name = 'Rawat'
and attdcode in ('KJ','PH','KE','PE','DL')
group by x.site, x.empcode, x.tdate
)
)
union all
select 'MPP' description, 0 from dual
union all
select 'Aktual' description, count(*)  from EPMS_USTP.empganghistorydetail_consol where month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and hr_name = 'Rawat'
union all
select 'Hadir' description, count(*) 
from
(
select x.site, x.empcode, x.tdate from EPMS_USTP.gangactivitydetail_consol x, EPMS_USTP.empganghistorydetail_consol  y 
where tdate = to_date(:p_date,'dd-mm-yyyy')
and month = extract(month from to_date(:p_date,'dd-mm-yyyy')) and year = extract(year from to_date(:p_date,'dd-mm-yyyy'))
and x.site = y.site
and x.empcode = y.empcode
and hr_name = 'Rawat'
and attdcode in ('KJ','PH','KE','PE','DL')
group by x.site, x.empcode, x.tdate
)
`

const QueryEmpat_Dumptruk = `select 
count(*) tersedia, 
sum(decode(status,'O',1,0)) ops, 
sum(decode(status,'S',1,0)) stb, 
sum(decode(status,'B',1,0)) brk 
from EPMS_USTP.vehicleavailability_consol where tdate = to_date(:p_date,'dd-mm-yyyy') 
and vehiclegroupcode in ('DT','DT20')
`

const QueryEmpat_Alatberat = `select 
count(*) tersedia, 
sum(decode(status,'O',1,0)) ops, 
sum(decode(status,'S',1,0)) stb, 
sum(decode(status,'B',1,0)) brk 
from EPMS_USTP.vehicleavailability_consol where tdate = to_date(:p_date,'dd-mm-yyyy') and units = 'HM' 
and vehiclegroupcode not in ('FTE','FT')
`
const QueryLima = `select 
--decode(site,'GCM',1,'SMG',2,'SJE',3,'SBE',4,'SLM',5,'USTP',10) seq,
--decode(intiplasma,'0','PLASMA','INTI') intiplasma, 
--site, 
--decode(site,'USTP','TOTAL', 'PLASMA USTP','TOTAL',decode(intiplasma,0,'PLASMA '||site, site) ) 
--comp, 
--sum(ha) luas_total,
--sum(jml) cnt_panen,
sum(case when umur between 10 and 12 then ha else 0 end) luas_1012,
sum(case when umur between 10 and 12 then jml else 0 end) cnt_1012,
sum(case when umur between 10 and 12 then jml else 0 end) / sum(jml) * 100 pct_1012,
sum(case when umur >= 13 then ha else 0 end) luas_l12,
sum(case when umur >= 13 then jml else 0 end) cnt_l12,
sum(case when umur >= 13 then jml else 0 end) / sum(jml) * 100 pct_l12
from
(
select site, intiplasma, umur, count(*) jml, sum(ha) ha
from
( 
select 'USTP' site, intiplasma, hectplanted ha, 
case 
when dd = 1 then decode(t1,'X',1,to_number(t1)) 
when dd = 2 then decode(t2,'X',1,to_number(t2)) 
when dd = 3 then decode(t3,'X',1,to_number(t3)) 
when dd = 4 then decode(t4,'X',1,to_number(t4)) 
when dd = 5 then decode(t5,'X',1,to_number(t5)) 
when dd = 6 then decode(t6,'X',1,to_number(t6)) 
when dd = 7 then decode(t7,'X',1,to_number(t7)) 
when dd = 8 then decode(t8,'X',1,to_number(t8)) 
when dd = 9 then decode(t9,'X',1,to_number(t9)) 
when dd = 10 then decode(t10,'X',1,to_number(t10)) 
when dd = 11 then decode(t11,'X',1,to_number(t11)) 
when dd = 12 then decode(t12,'X',1,to_number(t12)) 
when dd = 13 then decode(t13,'X',1,to_number(t13)) 
when dd = 14 then decode(t14,'X',1,to_number(t14)) 
when dd = 15 then decode(t15,'X',1,to_number(t15)) 
when dd = 16 then decode(t16,'X',1,to_number(t16)) 
when dd = 17 then decode(t17,'X',1,to_number(t17)) 
when dd = 18 then decode(t18,'X',1,to_number(t18)) 
when dd = 19 then decode(t19,'X',1,to_number(t19)) 
when dd = 20 then decode(t20,'X',1,to_number(t20)) 
when dd = 21 then decode(t21,'X',1,to_number(t21)) 
when dd = 22 then decode(t22,'X',1,to_number(t22)) 
when dd = 23 then decode(t23,'X',1,to_number(t23)) 
when dd = 24 then decode(t24,'X',1,to_number(t24)) 
when dd = 25 then decode(t25,'X',1,to_number(t25)) 
when dd = 26 then decode(t26,'X',1,to_number(t26)) 
when dd = 27 then decode(t27,'X',1,to_number(t27)) 
when dd = 28 then decode(t28,'X',1,to_number(t28)) 
when dd = 29 then decode(t29,'X',1,to_number(t29)) 
when dd = 30 then decode(t30,'X',1,to_number(t30)) 
when dd = 31 then decode(t31,'X',1,to_number(t31))  
 else 0 end umur
 from EPMS_USTP.emp_harv_rotation_consol x, (select to_number(extract(day from to_date(:p_date,'dd-mm-yyyy'))) dd from dual)
 where year = extract(year from to_date(:p_date,'dd-mm-yyyy')) and period = extract(month from to_date(:p_date,'dd-mm-yyyy'))
 )
 where intiplasma = 1
 group by site, intiplasma, umur
 ) group by site, intiplasma
 order by intiplasma, decode(site,'GCM',1,'SMG',2,'SJE',3,'SBE',4,'SLM',5,'USTP',10)
`

const QueryEnam = `select to_char(tdate, 'dd'), case when sum(tbsolah) = 0 then null else sum(production)/sum(tbsolah) * 100000 end oer
from 
(
select site, tdate, ffbprocessed tbsolah, 0 production from EPMS_USTP.ffbprocess_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm') and to_date(:p_date,'dd-mm-yyyy')
union all
select pks site, tdate, 0, production from productstoragedetail_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'CPO'
)
group by to_char(tdate, 'dd')
order by to_char(tdate, 'dd')

`

const QueryTujuh = `select to_char(tdate, 'dd'), case when sum(tbsolah) = 0 then null else sum(production)/sum(tbsolah) * 100000 end oer
from 
(
select site, tdate, ffbprocessed tbsolah, 0 production from EPMS_USTP.ffbprocess_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm') and to_date(:p_date,'dd-mm-yyyy')
union all
select pks site, tdate, 0, production from productstoragedetail_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'PK'
)
group by to_char(tdate, 'dd')
order by to_char(tdate, 'dd')

`

const QueryDelapan = `select 'OER' description, 
case when sum(tbsolah_hi) = 0 then null else sum(prod_hi)/sum(tbsolah_hi) * 100000 end oer_hi,
case when sum(tbsolah_bi) = 0 then null else sum(prod_bi)/sum(tbsolah_bi) * 100000 end oer_bi,
case when sum(tbsolah_sbi) = 0 then null else sum(prod_sbi)/sum(tbsolah_sbi) * 100000 end oer_sbi
from 
(
select site, 
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_sbi,
0 prod_hi,0 prod_bi,0 prod_sbi
from EPMS_USTP.ffbprocess_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
union all
select pks site, 0,0,0,
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_sbi
from productstoragedetail_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'CPO'
)
union all
select 
productcode||' '||'Production' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) sbi
from productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'CPO'
group by productcode
union all
select 
productcode||' '||'Dispatch' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) sbi
from productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'CPO'
group by productcode
union all
select 
productcode||' '||'Stock' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then ending else 0 end) hi,
null bi,
null sbi
from productstoragedetail_consol
where tdate = to_date(:p_date,'dd-mm-yyyy')
and productcode = 'CPO'
group by productcode
union all
select 
'Total Oil Losses/FFB'description,
avg(hi) hi, 
avg(bi/c_bi) bi,
avg(sbi/c_sbi) sbi
from
(
select
site,
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then value else null end) hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then value else null end) bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') and NVL(value,0) <>0 and INDICATORCODE = '01' then 1 else 0 end) c_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then value else 0 end) sbi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy')  and to_date(:p_date,'dd-mm-yyyy') and NVL(value,0) <>0 and INDICATORCODE = '01' then 1 else 0 end) c_sbi
from EPMS_USTP.V_OIL_PK_LOSSES_consol 
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and subsubgroupcode = '01'
group by site
)


`

const QuerySembilan = `select 'KER' description, 
case when sum(tbsolah_hi) = 0 then null else sum(prod_hi)/sum(tbsolah_hi) * 100000 end oer_hi,
case when sum(tbsolah_bi) = 0 then null else sum(prod_bi)/sum(tbsolah_bi) * 100000 end oer_bi,
case when sum(tbsolah_sbi) = 0 then null else sum(prod_sbi)/sum(tbsolah_sbi) * 100000 end oer_sbi
from 
(
select site, 
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then ffbprocessed else 0 end) tbsolah_sbi,
0 prod_hi,0 prod_bi,0 prod_sbi
from EPMS_USTP.ffbprocess_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
union all
select pks site, 0,0,0,
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) prod_sbi
from productstoragedetail_consol where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'PK'
)
union all
select 
productcode||' '||'Production' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then production else 0 end) hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then production else 0 end) sbi
from productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'PK'
group by productcode
union all
select 
productcode||' '||'Dispatch' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then dispatch else 0 end) sbi
from productstoragedetail_consol
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and productcode = 'PK'
group by productcode
union all
select 
productcode||' '||'Stock' description, sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then ending else 0 end) hi,
null bi,
null sbi
from productstoragedetail_consol
where tdate = to_date(:p_date,'dd-mm-yyyy')
and productcode = 'PK'
group by productcode
union all
select 
'Total Kernel Losses/FFB' description, 
avg(hi) hi, 
avg(bi/c_bi) bi,
avg(sbi/c_sbi) sbi
from
(
select
site,
sum(case when tdate = to_date(:p_date,'dd-mm-yyyy') then value else null end) hi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') then value else null end) bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'mm')  and to_date(:p_date,'dd-mm-yyyy') and NVL(value,0) <>0 and INDICATORCODE = '02' then 1 else 0 end) c_bi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy') then value else 0 end) sbi,
sum(case when tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy')  and to_date(:p_date,'dd-mm-yyyy') and NVL(value,0) <>0 and INDICATORCODE = '02' then 1 else 0 end) c_sbi
from EPMS_USTP.V_OIL_PK_LOSSES_consol 
where tdate between trunc(to_date(:p_date,'dd-mm-yyyy'),'yyyy') and to_date(:p_date,'dd-mm-yyyy')
and subsubgroupcode = '02'
group by site
)`


const fetchData = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '11-04-2018'
// console.log(Query)
    try {
        result = await database.siteExecute(users,Query, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

const fetchDataDua = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '11-04-2018'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QueryDua, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

const fetchDataTigaPanen = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '10-11-2022'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QueryTiga_Panen, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

const fetchDataTigaRawat = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '10-11-2022'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QueryTiga_Rawat, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

const fetchDataEmpatDumptruk = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '10-11-2022'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QueryEmpat_Dumptruk, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

const fetchDataEmpatAlatberat = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '10-11-2022'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QueryEmpat_Alatberat, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

const fetchDataLima = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '10-11-2022'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QueryLima, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}


const fetchDataEnam = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '10-11-2022'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QueryEnam, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

const fetchDataTujuh = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '10-11-2022'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QueryTujuh, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

const fetchDataDelapan = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '10-11-2022'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QueryDelapan, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

const fetchDataSembilan = async function (users, callback) {

    let result

    binds = {}
    binds.p_date = '10-11-2022'
// console.log(Query)
    try {
        result = await database.siteExecute(users,QuerySembilan, binds)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result))
        return callback('', [])


    callback('', result.rows)
}

module.exports = {
    fetchData,
    fetchDataDua,
    fetchDataTigaPanen,
    fetchDataTigaRawat,
    fetchDataEmpatDumptruk,
    fetchDataEmpatAlatberat,
    fetchDataLima,
    fetchDataEnam,
    fetchDataTujuh,
    fetchDataDelapan,
    fetchDataSembilan
}