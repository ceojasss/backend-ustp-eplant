const QtyBarang = `select  kode "kode" ,des "des" from (
    select '1' kode,'1' des from dual
    union all
    select '2' kode,'2' des from dual 
    union all
    select '3' kode,'3' des from dual
    union all
    select '4' kode, '4' des from dual
    union all
    select '5' kode, '5' des from dual
     union all
    select '6' kode, '6' des from dual
    union all
    select '7' kode, '7' des from dual
    union all
    select '8' kode, '8' des from dual
    union all
    select '9' kode, '9' des from dual
    union all
    select '10' kode, '10' des from dual
    union all
    select '11' kode, '11' des from dual
    union all
    select '12' kode, '12' des from dual
    union all
    select '13' kode, '13' des from dual
     union all
    select '14' kode, '14' des from dual
    union all
    select '15' kode, '15' des from dual
    union all
    select '16' kode, '16' des from dual
    union all
    select '17' kode, '17' des from dual
    union all
    select '18' kode, '18' des from dual
    union all
    select '19' kode, '19' des from dual
    union all
    select '20' kode, '20' des from dual
    union all
    select '21' kode, '21' des from dual
    union all
    select '22' kode, '22' des from dual
    union all
    select '23' kode, '23' des from dual
    union all
    select '24' kode, '24' des from dual
    union all
    select '25' kode, '25' des from dual
    union all
    select '26' kode, '26' des from dual
    union all
    select '27' kode, '27' des from dual
    union all
    select '28' kode, '28' des from dual
    union all
    select '29' kode, '29' des from dual
    union all
    select '30' kode, '30' des from dual
    union all
    select '31' kode, '31' des from dual
    union all
    select '32' kode, '32' des from dual
    union all
    select '33' kode, '33' des from dual
    union all
    select '34' kode, '34' des from dual
    union all
    select '35' kode, '35' des from dual
    union all
    select '36' kode, '36' des from dual
    union all
    select '37' kode, '37' des from dual
     union all
    select '38' kode, '38' des from dual
    union all
    select '39' kode, '39' des from dual
    union all
    select '40' kode, '40' des from dual
    union all
    select '41' kode, '41' des from dual
    union all
    select '42' kode, '42' des from dual
    union all
    select '43' kode, '43' des from dual
    union all
    select '44' kode, '44' des from dual
    union all
    select '45' kode, '45' des from dual
    union all
    select '46' kode, '46' des from dual
     union all
    select '47' kode, '47' des from dual
    union all
    select '48' kode, '48' des from dual
    union all
    select '49' kode, '49' des from dual
    union all
    select '50' kode, '50' des from dual
    )
    where kode like  ('%'||:0||'%')`

module.exports = QtyBarang