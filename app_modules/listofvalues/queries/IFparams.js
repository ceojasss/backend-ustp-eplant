const ifparams = `SELECT   DISTINCT ifcode "ifcode", ifname "ifname"
FROM   (SELECT   i.ifcode, i.ifname
          FROM   infrastructure i, blockorg b
         WHERE   i.blockid = b.blockid AND i.estate = b.estatecode
                 AND estate =
                       DECODE (:1,
                               'ALL', estate,
                               :1)
                 AND i.division =
                       DECODE (:2,
                               'ALL', i.division,
                               :2)
                 AND i.iftype =
                       DECODE (:3,
                               'ALL', i.iftype,
                               :3)
                 AND i.ifsubtype =
                       DECODE (:4,
                               'ALL', i.ifsubtype,
                               :4)
                 AND 'E' IN
                          (SELECT   DISTINCT functioncode FROM organization)
        UNION ALL
        SELECT   ifcode, ifname
          FROM   infrastructure
         WHERE   estate =
                    DECODE (:1,
                            'ALL', estate,
                            :1)
                 AND division =
                       DECODE (:2,
                               'ALL', division,
                               :2)
                 AND iftype =
                       DECODE (:3,
                               'ALL', iftype,
                               :3)
                 AND ifsubtype =
                       DECODE (:4,
                               'ALL', ifsubtype,
                               :4)
                 AND 'F' IN
                          (SELECT   DISTINCT functioncode FROM organization)                              
        UNION ALL
        SELECT   fieldcode ifcode, description ifname
          FROM   fieldcrop
         WHERE   estatecode = :1
                 AND divisioncode = :2
                 AND 'OP' = :3
                 AND 'OP' = :4
        UNION ALL
        SELECT   x.blockid ifcode, description ifname
          FROM   blockorg x, blockmaster y
         WHERE   estatecode = :1
                 AND divisioncode = :2
                 AND x.blockid = y.blockid 
                 AND 'LC' = :3
                 AND 'LC' = :4
                          ) where ((ifcode) like upper ('%'||:0||'%') or (ifname) like upper ('%'||:0||'%'))  and rownum < 50
ORDER BY ifcode`

module.exports = ifparams