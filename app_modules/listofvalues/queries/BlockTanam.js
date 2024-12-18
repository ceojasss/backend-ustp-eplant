const BlockTanam = `SELECT BM.fieldcode "fieldcode", BM.DESCRIPTION "description"
FROM fieldcrop bm
WHERE     blockid = :1
     AND (   UPPER (bm.fieldcode) LIKE '%' || :0 || '%'
          OR UPPER (bm.description) LIKE '%' || :0 || '%')
          order by bm.fieldcode`

module.exports = BlockTanam