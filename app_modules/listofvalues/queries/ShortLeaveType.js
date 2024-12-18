const shortleavetype = `select leave_type, des from (
    select '0' leave_type, 'TERLAMBAT MASUK KANTOR' des from dual
    union all
    select '1' leave_type, 'MENINGGALKAN KANTOR' des from dual
    union all
    select '2' leave_type, 'DINAS DALAM' des from dual
    )
    where des like  ('%'||:0||'%')`

module.exports = shortleavetype