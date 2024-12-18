const VehicleGroup = `select Vehiclegroupcode "groupcode", description "description",units "units" from vehiclegroup
where ( upper(Vehiclegroupcode) like upper('%'||:0||'%') 
          or UPPER (description) LIKE UPPER ('%'||:0||'%')
          or UPPER (units) LIKE UPPER ('%'||:0||'%'))
order by vehiclegroupcode`

module.exports = VehicleGroup