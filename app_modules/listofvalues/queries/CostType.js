const Costtype = `select kode "code", des "description" from (
    select 'CAPEX' kode, 'CAPEX' des from dual
    union all
    select 'OPEX' kode, 'OPEX' des from dual
    )
    where des like upper ('%'||:0||'%')
`

module.exports = Costtype