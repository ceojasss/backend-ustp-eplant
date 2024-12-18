const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `


const baseQuery = `select ROWID "rowid",wocompletionno "wocompletionno", workorderno "workorderno#code", 
to_char(completiondate, 'dd-mm-yyyy') "completiondate",
description "description", 
inputby "inputby",
v_url_preview_site (
    'WO',
    CASE
        WHEN process_flag IS NULL THEN 'DRAFT'
        ELSE 'APPROVED'
    END)||workorderno "v_url_preview",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
process_flag "process_flag"
from wocompletion
where
    (   wocompletionno LIKE UPPER ('%' || :search || '%')
     OR workorderno LIKE UPPER ('%' || :search || '%'))
AND TO_CHAR (completiondate, 'mmyyyy') =
    NVL (TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'), 'mmyyyy'),
         TO_CHAR (completiondate, 'mmyyyy'))
order by wocompletionno
`



// const baseQuery = `SELECT distinct
// a.ROWID "rowid",
// a.wocompletionno "wocompletionno",
// a.workorderno "workorderno",
// to_char(a.completiondate,'dd-mm-yyyy')    "completiondate",
// a.description "description",
// a.inputby "inputby",
// to_char(a.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
// a.updateby "updateby", 
// to_char(a.updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
// b.itemcode "itemcodedisplayonly", b.quantity "qtydisplayonly", c.descriptions "detailpekerjaandisplayonly", c.estimaterhours "estimasijamdisplayonly" 
// FROM wocompletion a , workorderdetailmaterial b, workorderdetailactivity c
// where a.workorderno=b.workorderno  and a.workorderno=c.workorderno
// order by "workorderno"`


const detailQuery=`select "rowid","workorderno","mic/siv","stockcode","quantity","remarks"  from (
    select rowid "rowid",workorderno"workorderno",mic||'-'||get_empname(mic) "mic/siv",descriptions "remarks",null "quantity",null "stockcode" from Workorderdetailactivity a
    where workorderno = :workorderno
    union all
    select rowid "rowid",workorder"workorderno",sivcode "mic/siv",remarks "remarks",quantity "quantity",stockcode "stockcode" from sivdetails b where workorder=:workorderno
    )`

const viewdata = `select rowid "rowid",workorderno "workorderno",descriptions "descriptions",mic||'-'||get_empname(mic) "mic",TO_CHAR (tdate, 'dd-mm-yyyy')"tdate", tid "tid",
TO_CHAR (jamawal, 'hh24:mi') "jamawal",TO_CHAR (jamakhir, 'hh24:mi') "jamakhir" from Workorderdetailactivity
where workorderno = :workorderno`

const viewdataDetail = `select sivcode "sivcode", stockcode "stockcode", quantity "quantity", remarks "remarks" from sivdetails where workorder=:workorderno`


const fetchDataHeader = async function (users,params, route, callback) {

    binds = {}
    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)
    binds.search = (!params.search ? '' : params.search)
    let result

    // console.log(route)

    try {
        result = await database.siteLimitExecute(users, route, baseQuery, binds)

        //console.log(result)

    } catch (error) {
        console.log('db error :', error.message)

        callback(error.message, '')
    }

    callback('', result)
}


const fetchDataDetail = async function (users, routes, params, callback) {

  binds = {}

  /**
   * ! change the parameters according to the table
   */



  binds.workorderno = (!params.workorder ? '' : params.workorder)

  let result

  try {
      result = await database.siteWithDefExecute(users, routes, detailQuery, binds)

  } catch (error) {
      callback(error, '')
  }



  callback('', result)
}

const fetchDataView = async function (users, routes, params, callback) {

  binds = {}

  /**
   * ! change the parameters according to the table
   */



  binds.workorderno = (!params.workorder ? '' : params.workorder)

  let result

  try {
      result = await database.siteWithDefExecute(users, routes, viewdata, binds)

  } catch (error) {
      callback(error, '')
  }



  callback('', result)
}


const fetchDataViewDetail = async function (users, routes, params, callback) {

  binds = {}

  /**
   * ! change the parameters according to the table
   */



  binds.workorderno = (!params.workorder ? '' : params.workorder)

  let result

  try {
      result = await database.siteWithDefExecute(users, routes, viewdataDetail, binds)

  } catch (error) {
      callback(error, '')
  }



  callback('', result)
}





module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    fetchDataView,
    fetchDataViewDetail
}


