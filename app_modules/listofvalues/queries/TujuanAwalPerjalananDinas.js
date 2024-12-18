const tujuanawalperjalanandinas = `select kode, des from (
    select 'BHMS' kode, 'BHMS' des from dual
    union all
    select 'GCM' kode, 'GCM' des from dual
    union all
    select 'SMG' kode, 'SMG' des from dual
    union all
    select 'SJE' kode, 'SJE' des from dual
    union all
    select 'SBE' kode, 'SBE' des from dual
    union all
    select 'SLM' kode, 'SLM' des from dual
    union all
    select 'PANGKALAN BUN' kode, 'PANGKALAN BUN' des from dual
    union all
    select 'KETAPANG' kode, 'KETAPANG' des from dual
    union all
    select 'PONTIANAK' kode, 'PONTIANAK' des from dual
    union all
    select 'SAMPIT' kode, 'SAMPIT' des from dual
    union all
    select 'SERUYAN' kode, 'SERUYAN' des from dual
    union all
    select 'PALANGKA RAYA' kode, 'PALANGKA RAYA' des from dual
    union all
    select 'BANJARMASIN' kode, 'BANJARMASIN' des from dual
    union all
    select 'TIDAK BOOK KENDARAAN' kode, 'TIDAK BOOK KENDARAAN' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = tujuanawalperjalanandinas