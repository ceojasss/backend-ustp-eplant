const warehouse = `SELECT   STORECODE "code",STORENAME "description"
FROM   STOREINFO
WHERE   INACTIVEDATE IS NULL and (   (storecode) LIKE UPPER ('%' || :0 || '%')
        OR (storename) LIKE ('%' || :0 || '%')) 
        and CASE WHEN storecode IN ('GSP', 'GH') THEN 'AO'  WHEN storecode in ('GF','GS') THEN 'GS' ELSE substr(storecode,1,2)
        END = (select department from epmsapps.userprofile where loginid = :1)
        `

module.exports = warehouse

// --and CASE WHEN storecode IN ('GSP', 'GH') THEN 'AO' ELSE storecode END = (select department from epmsapps.userprofile where loginid = :1)
