const Millworkergroup = `SELECT groupcode "p_group",
TRIM (REPLACE (description, 'PABRIK', '')) "description"
FROM group_position
WHERE mod_code = 'M'
and  groupcode like ('%'||:0||'%')
ORDER BY groupcode`

module.exports = Millworkergroup