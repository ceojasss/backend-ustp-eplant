const BlockMaster = `SELECT BM.BLOCKID "blockid", BM.DESCRIPTION "description"
FROM blockmaster bm
WHERE  (   UPPER (bm.blockid) LIKE '%' || :0 || '%'
          OR UPPER (bm.description) LIKE '%' || :0 || '%')
          order by bm.blockid`

module.exports = BlockMaster