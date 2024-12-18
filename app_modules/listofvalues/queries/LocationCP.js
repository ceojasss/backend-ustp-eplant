const Location = `
select location "code" , description "descripiton" from(
    select 'DUM/BLW' location , 'DUM/BLW' description from dual
    union 
    select 'MALAYSIA'location  , 'MALAYSIA'description from dual
    union
    select 'ROTERDAM'location , 'ROTERDAM'description from dual
    )
    where  ( location like upper('%'||:0||'%')  or description LIKE UPPER ('%'||:0||'%') )
    order by location`

module.exports = Location