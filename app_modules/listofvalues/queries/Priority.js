// const Priority=`select kode "code", des "description" from (
//     select 'Low' kode, 'Low' des from dual
//     union all
//     select 'Low' kode, 'Low' des from dual
//     union all
//     select 'Low' kode, 'Low' des from dual
//     )
//     where des like upper ('%'||:0||'%')`;
// module.exports = Priority
const Priority=`select kode "code", des "description" from (
    select 0 kode, 'Low' des from dual
    union all
    select 1 kode, 'Medium' des from dual
    union all
    select 2 kode, 'High' des from dual
    )
    where des like upper ('%'||:0||'%')`;
module.exports = Priority