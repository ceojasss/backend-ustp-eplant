const Itemrtn = `
SELECT   a.stockcode "stockcode",
         a.description "description",
         a.locationtype "locationtype",
         a.locationcode "locationcode",
         a.jobcode "jobcode",
         a.uom "uom",
         a.quantity - NVL (b.qtyreturn, 0) "quantity"
  FROM      (SELECT   sivcode,
                      stockcode,
                      get_purchaseitemname (stockcode) description,
                      uomcode uom,
                      locationcode,
                      locationtype,
                      jobcode,
                      getjob_des (jobcode) jobdescription,
                      quantity
               FROM   sivdetails s, purchaseitem pi
              WHERE   pi.itemcode = s.stockcode AND sivcode = :1
                      AND (sivcode LIKE UPPER ('%' || :0 || '%')
                           OR stockcode LIKE UPPER ('%' || :0 || '%')
                           OR get_purchaseitemname (stockcode) LIKE
                                UPPER ('%' || :0 || '%'))) a
         LEFT JOIN
            (SELECT   sivcode, qtyreturn, stockcode, LOCATIONTYPE, LOCATIONCODE, JOBCODE
               FROM   returntostore rtn, returntostoredetail rtnd
              WHERE   rtn.RETURNNOTENUMBER = rtnd.RETURNNOTENUMBER) b
         ON a.sivcode = b.sivcode AND a.stockcode = b.stockcode
         AND a.LOCATIONTYPE = b.LOCATIONTYPE
         and a.LOCATIONCODE = b.LOCATIONCODE
         and a.JOBCODE = b.jobcode`

module.exports = Itemrtn