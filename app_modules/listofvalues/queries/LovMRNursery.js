const mrnursery = `
SELECT   md.MRCODE "mrcode",
           md.quantity "qtyrequestdisplayonly",
           mn.mrnurserycode "nurserycodedisplayonly",
           TO_CHAR (MRDATE, 'dd-mm-yyyy') "mrdate",
           MRNOTES "mrnotes",
           PROCESS_FLAG "process_flag",
           DOC_RELEASE_STATUS_F (md.MRCODE) "last_flag"
    FROM   MR_nursery mn, mrdetails_nursery md
   WHERE   mn.mrcode = md.mrcode
           AND mrdate >= SYSDATE - 60 
           AND NVL (process_flag, 'SUBMITED') IN
                                       ('APPROVED')
           AND md.MRCODE IN
                    (SELECT   DISTINCT MRCODE
                       FROM   MRDETAILS_nursery
                      WHERE   NOT EXISTS
                                 (SELECT   *
                                    FROM   siv_nursery o
                                   WHERE   o.mrcode = MRDETAILS_nursery.mrcode)
                              AND mrcode IN
                                       (SELECT   mrcode
                                          FROM   mr_nursery
                                         WHERE   mrdate <=
                                                    LAST_DAY(TO_DATE (
                                                                :1,
                                                                'DD-MM-YYYY'
                                                             )))
                              AND NVL (process_flag, 'SUBMITED') IN
                                       ('SUBMITED', 'CREATED', 'APPROVED'))
           AND ( (mrnotes) LIKE UPPER ('%' || :0 || '%')
                OR (md.mrcode) LIKE UPPER ('%' || :0 || '%'))
ORDER BY   md.mrcode, mrdate DESC
`

module.exports = mrnursery