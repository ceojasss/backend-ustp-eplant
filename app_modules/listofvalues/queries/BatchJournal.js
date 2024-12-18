const BatchJournal = `
SELECT batchno           "batchno",
financialyear     "financialyear",
periodno          "periodno",
currency "currency",
description       "description"
FROM batch
WHERE (   UPPER (batchno) LIKE UPPER ('%' || :1 || '%')
 OR UPPER (description) LIKE UPPER ('%' || :1 || '%'))
ORDER BY financialyear DESC, periodno DESC`

module.exports = BatchJournal
