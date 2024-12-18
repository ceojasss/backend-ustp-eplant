const Ref = `select kode, des from (
   select 1 kode, 'Partial Delivery' des from dual
   union all
   select 0 kode, 'Full Delivery' des from dual
   )
   where des like  ('%'||:0||'%')`

module.exports = Ref