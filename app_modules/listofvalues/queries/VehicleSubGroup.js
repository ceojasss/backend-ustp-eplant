const VehicleSubGroup = `select vehiclesubgroupcode "code", description "description" from vehiclesubgroup where  VEHICLEGROUPCODE = :1 and 
vehiclesubgroupcode like upper('%'||:0||'%') or description like upper('%'||:0||'%')`

module.exports = VehicleSubGroup