const Machine = `SELECT machinecode "machinecode", v.description "description", g.groupcode  ||' - '||g.description "group"
FROM machine v,machinegroup g
WHERE     v.groupcode = g.groupcode
and v.inactivedate IS NULL 
     and ( upper(machinecode) like upper('%'||:0||'%') 
          or UPPER (v.description) LIKE UPPER ('%'||:0||'%')
          or UPPER (g.description) LIKE UPPER ('%'||:0||'%')
          or UPPER (v.groupcode) LIKE UPPER ('%'||:0||'%'))
     order by machinecode`

module.exports = Machine