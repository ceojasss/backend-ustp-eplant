const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `select  a.rowid "rowid",transferreceivecode "transferreceivecode",
v_url_preview_site (
  'TRI',
  CASE WHEN a.process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || transferreceivecode "v_url_preview",a.process_flag "process_flag",
to_char(b.wodate,'dd-mm-yyyy')"wodate",
to_char(transferreceivedate,'dd-mm-yyyy') "transferreceivedate",a.fromstore "fromstore",a.tostore "tostore",
transferincode "transferincode#code",a.inputby "inputby",to_char(a.inputdate, 'dd-mm-yyyy') "inputdate", 
a.updateby "updateby", to_char(a.updatedate, 'dd-mm-yyyy') "updatedate"  
from TRANSFERRECEIVE a, transfervoucher b 
where a.transferincode= b.transfercode and
(transferreceivecode LIKE  UPPER('%' || :search ||'%') OR transferincode LIKE  UPPER('%' || :search ||'%'))
and to_char(transferreceivedate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(transferreceivedate,'mmyyyy')) ORDER BY transferreceivedate DESC`;

/**
 * ! change query table detail
 */
const detailQuery = `SELECT b.itemcode                            "itemcode",
itemdescrption     "itemdescrption",
b.quantity                            "qtytransferdisplayonly",
NVL (rc.QTY_RECEIVED, 0)              "qty_receiveddisplayonly",
s.rowid "rowid",
s.tid "tid",s.transferreceivecode "transferreceivecode",
s.quantityreceive "quantityreceive",a.transfercode "transferincode",to_char(tf.transferreceivedate, 'dd-mm-yyyy') "transferreceivedate",
s.remarks "remarks",s.inputby "inputby",to_char(s.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", s.updateby "updateby", to_char(s.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
FROM transferdetails  b,
transfervoucher  a,transferreceivedetail s,transferreceive  tf,
(  SELECT td.itemcode, SUM (td.quantityreceive) qty_received
     FROM transferreceivedetail td, transferreceive t
    WHERE     td.transferreceivecode = t.transferreceivecode
          AND t.transferincode = :transferincode
          AND t.transferreceivedate <
              TO_DATE ( :wodate, 'dd-mm-yyyy')
          AND t.transferreceivecode <> :transferreceivecode
 GROUP BY td.itemcode) rc
WHERE     A.transfercode = b.transfercode
and  s.transferreceivecode = tf.transferreceivecode(+)
AND A.transfercode = :transferincode
AND b.itemcode = rc.itemcode(+)
AND b.quantity > NVL (rc.QTY_RECEIVED, 0)
AND s.transferreceivecode = :transferreceivecode
AND b.itemcode = s.itemcode`;

const requestData = 
`SELECT b.itemcode                            "itemcode",
get_purchaseitemname (b.itemcode)     "itemdescrption",
b.quantity                            "qtytransferdisplayonly",
NVL (rc.QTY_RECEIVED, 0)              "qty_receiveddisplayonly"
FROM transferdetails  b,
transfervoucher  a,
(  SELECT td.itemcode, SUM (td.quantityreceive) qty_received
     FROM transferreceivedetail td, transferreceive t
    WHERE     td.transferreceivecode = t.transferreceivecode
          AND t.transferincode = :transferincode
          AND t.transferreceivedate <
              TO_DATE ( :wodate, 'dd-mm-yyyy')
          AND t.transferreceivecode <> :transferreceivecode
 GROUP BY td.itemcode) rc
WHERE     A.transfercode = b.transfercode
AND A.transfercode = :transferincode
AND b.itemcode = rc.itemcode(+)
AND b.quantity > NVL (rc.QTY_RECEIVED, 0)
`;

const fetchDataHeader = async function (users, params, routes, callback) {
  binds = {};

  binds.limitsize = !params.size ? 0 : params.size;
  binds.page = !params.page ? 1 : params.page;
  binds.search = !params.search ? "" : params.search;
  binds.dateperiode = !params.dateperiode ? "" : params.dateperiode;

  let result;

  try {
    result = await database.siteLimitExecute(users, routes, baseQuery, binds);

    // console.log(result)
  } catch (error) {
    callback(error, "");
  }
  callback("", result);
};
const fetchDataDetail = async function (users, routes, params, callback) {
  binds = {};

  /**
   * ! change the parameters according to the table
   */
  binds.transferreceivecode = !params.transferreceivecode? "": params.transferreceivecode;
    binds.transferincode = !params.transferincode ? "" : params.transferincode;
    binds.wodate = !params.wodate ? "" : params.wodate;
  let result;
console.log(binds)
  try {
    result = await database.siteWithDefExecute(
      users,
      routes,
      detailQuery,
      binds
    );
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};
const fetchDataLinkDetails = async function (users, routes, params, callback) {
  binds = {};

  /**
   * ! change the parameters according to the table
   */


  binds.transferreceivecode = !params.transferreceivecode ? "" : params.transferreceivecode;
  binds.transferincode = !params.transferincode ? "" : params.transferincode;
  binds.wodate = !params.wodate ? "" : params.wodate;

  let result;

  try {
    result = await database.siteWithDefExecute(
      users,
      routes,
      requestData,
      binds
    );
    console.log(result)
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};

module.exports = {
  fetchDataHeader,
  fetchDataDetail,
  fetchDataLinkDetails,
};
