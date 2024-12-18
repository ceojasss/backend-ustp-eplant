const accred = `select  kode "kode" ,accred "accreditation" from (
    select '1' kode,'Akreditasi A+' accred from dual
    union all
    select '2' kode,'Akreditasi A' accred from dual
    union all
    select '3' kode,'Akreditasi B' accred from dual
    union all
    select '4' kode,'Akreditasi C' accred from dual
    union all
    select '5' kode,'Akreditasi Diakui' accred from dual
    union all
    select '6' kode,'Akreditasi Terdaftar' accred from dual)
    where kode like  ('%'||:0||'%')`

module.exports = accred
