const Ref = `SELECT sivcode                                  "sivcode",
stockcode                                "itemcode",
jobcode                                  "jobcode",
quantity                                 "quantity",
locationcode                             "locationcode",
get_purchaseitemname (stockcode)         "item desc",
getjob_des (jobcode)                     "job desc"
FROM sivdetails
WHERE     locationtype = 'OP'
AND jobcode LIKE 'P04%'
AND (sivcode, stockcode, locationcode) NOT IN
            (SELECT NVL (a.sivcode, 'X'),
                    NVL (a.siv_stockcode, 'X'),
                    NVL (a.locationcode, 'X')
               FROM vehicleactivity a
              WHERE sivcode IS NOT NULL)
AND stockcode LIKE 'A%'
AND UPPER (sivcode) LIKE UPPER ('%' || :0 || '%')
AND jobcode = :2
AND locationcode = :1
AND NVL(EMDEK,'0') = '1'
UNION ALL
SELECT 'SIV-' || parametervalue || '/' || :3         sivcode,
parametervalue                                stockcode,
'P040007'                                     jobcode,
1000                                          quantity,
:1,
parametervalue                                itemdesc,
getjob_des ('P040007')                        jobdesc
FROM parametervalue
WHERE parametercode = 'EP099' AND :2 IN ('P040007', 'P040023')
ORDER BY "sivcode", "itemcode"`

module.exports = Ref