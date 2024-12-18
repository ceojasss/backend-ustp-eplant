const Block = `
select x.blockid "blockid", description "descconcessiondisplayonly", estatecode "estatecode", divisioncode "divisioncode", 
y.intiplasma "intiplasma", divisioncode_plasma "divisioncodeplasma", 'OP' "croptype"
from blockmaster x, blockorg y
where x.blockid = y.blockid
and 
 (   UPPER (x.blockid) LIKE '%' || :0 || '%'
          OR UPPER (description) LIKE '%' || :0 || '%')
          order by x.blockid`

module.exports = Block
