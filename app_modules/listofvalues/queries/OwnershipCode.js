const ownershipcode = `select ownershipcode "ownershipcode", description "description" from (
    select '0' ownershipcode, 'Internal' description from dual
    union all
    select '1' ownershipcode, 'External' description from dual
    union all
    select '2' ownershipcode, 'Sewa' description from dual)
    where ownershipcode like  ('%'||:0||'%')`

module.exports = ownershipcode
