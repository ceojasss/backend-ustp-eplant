const Grading = `select empcode "code", empname||' ('||empcode||')'  "description" from empmasterepms where (upper (empcode) like upper ('%'||:0||'%') OR upper (empname) like upper ('%'||:0||'%')) and id_position in ('42204','42320') and dateterminate is null
order by empcode, empname`

module.exports = Grading