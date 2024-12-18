const Location = `
select locationcode "locationcode",description "description"
 from location
WHERE   locationtypecode=:1
and inactivedate is null
and ( locationcode like upper('%'||:0||'%')  or description LIKE UPPER ('%'||:0||'%') )
order by locationcode`

module.exports = Location