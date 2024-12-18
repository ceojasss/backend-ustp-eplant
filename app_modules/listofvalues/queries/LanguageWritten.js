const LanguageWritten = `select  kode "kode" ,des "des" from (
    select 'POOR' kode,'POOR' des from dual
    union all
    select 'GOOD' kode,'GOOD' des from dual 
    union all
    select 'EXCELLENT' kode,'EXCELLENT' des from dual)
    where kode like  ('%'||:0||'%')`

module.exports = LanguageWritten
