const SubGroupMachine = `select /*groupcode "groupcode" ,*/parametervaluecode "code",parametervalue "description" from
(select case 
when parametervaluecode like  'PH%' then 'MG'
when parametervaluecode like  'MG%' then 'MG'
when parametervaluecode like  'WP%' then 'WP'
else 'OTH' end
groupcode, parametervaluecode , parametervalue from parametervalue where parametercode = 'MAC01'
) 
where groupcode=:1 
and
( upper(parametervaluecode) like upper('%'||:0||'%') or UPPER (parametervalue) LIKE UPPER ('%'||:0||'%'))
order by 1, 2`

module.exports = SubGroupMachine