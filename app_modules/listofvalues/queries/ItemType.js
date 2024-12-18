const itemtype = `select itemtype "itemtype", description "description" from (
    select 0 itemtype, 'Stock Item' description from dual
    union all
    select 1 itemtype, 'Fixed Asset' description from dual
    union all
    select 2 itemtype, 'Seeding' description from dual
    union all
    select 3 itemtype, 'Expenses' description from dual)
    where itemtype like  ('%'||:0||'%')`

module.exports = itemtype
