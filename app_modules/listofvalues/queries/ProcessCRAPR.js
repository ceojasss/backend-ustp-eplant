const ProcessCRAPR=`select kode "code", des "description" from (
    select 'CREATED' kode, 'CREATED' des from dual
    union all
    select 'APPROVED' kode, 'APPROVED' des from dual 
    )
    where des like upper ('%'||:0||'%')`;
module.exports = ProcessCRAPR