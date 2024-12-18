const BlockMasterUsage = 
`SELECT CONCESSIONID "concessionid", BLOCKID "blockid" 
FROM blockmaster 
WHERE  concessionid = concessionid AND
(UPPER (concessionid) LIKE UPPER ('%' || :0 || '%') OR 
UPPER (blockid) LIKE UPPER ('%' || :0 || '%'))`
module.exports  = BlockMasterUsage;


