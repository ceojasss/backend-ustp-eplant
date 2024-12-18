const Vehicle = `SELECT Vehiclecode "code", v.description "description", g.vehiclegroupcode  ||' - '||g.description "group"
FROM Vehicle v,vehiclegroup g
WHERE     v.vehiclegroupcode = g.vehiclegroupcode
and inactivedate IS NULL 
     and ( upper(vehiclecode) like upper('%'||:0||'%') 
          or UPPER (v.description) LIKE UPPER ('%'||:0||'%')
          or UPPER (g.description) LIKE UPPER ('%'||:0||'%')
          or UPPER (v.vehiclegroupcode) LIKE UPPER ('%'||:0||'%'))
     order by vehiclecode `

module.exports = Vehicle