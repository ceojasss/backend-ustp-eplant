const StorageType = `SELECT CODE "code", DESCR "descr" FROM
( SELECT 'CPO' code,'Storage Tank' descr
FROM DUAL
UNION ALL
SELECT 'BLK' code, 'Bulking Storage' descr
FROM DUAL
UNION ALL
SELECT 'Others' code, 'Others' descr
FROM DUAL) WHERE :1 like upper('%'||:0||'%')
UNION ALL
SELECT CODE, DESCR FROM
( SELECT 'BS' code, 'bulk silo' descr
FROM DUAL
UNION ALL
SELECT 'BIN' code, 'Hoper / BIN' descr
FROM DUAL
UNION ALL
SELECT 'Floor' code, 'floor' descr
FROM DUAL
UNION ALL
SELECT 'Others' code, 'others' descr
FROM DUAL )
WHERE :1  like upper('%'||:0||'%')`

module.exports = StorageType