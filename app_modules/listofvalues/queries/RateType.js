const RateType=`select kode "code", des "description" from (
    select '0' kode, 'Fixed Rate' des from dual
    union all
    select '1' kode, 'Flowed Rate' des from dual
    )
    where des like upper ('%'||:0||'%')`;
module.exports = RateType
