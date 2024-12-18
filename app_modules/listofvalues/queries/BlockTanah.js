const BlockTanah = `SELECT BM.BLOCKID "blockid", BM.DESCRIPTION "description"
FROM blockorg bo, blockmaster bm
WHERE     bo.blockid = bm.blockid
     AND estatecode = :1
     AND divisioncode = :2
     AND (   (bm.blockid) LIKE UPPER ('%' || :0 || '%')
          OR (bm.description) LIKE UPPER ('%' || :0 || '%'))
          order by bm.blockid`
          
module.exports = BlockTanah
