const VehicleGroup = `select vehiclegroupcode "code",description || ' ('||vehiclegroupcode|| ')' "description" from (SELECT   vehiclegroupcode, description  
    FROM   vehiclegroup
   WHERE   EXISTS (SELECT   1
                     FROM   vehicle
                    WHERE   vehicle.vehiclegroupcode = vehiclegroup.vehiclegroupcode)
  UNION
  SELECT   DISTINCT GROUPCODE vehiclegroupcode,DECODE (GROUPCODE,
                            'MG',
                            'Genset',
                            'WP',
                            'Water Pump','Other Machine')
                       description
    FROM   MACHINE
   WHERE   GROUPCODE IN ('MG', 'WP','OTH')
  UNION
  SELECT    'ALL' vehiclegroupcode,'ALL' description FROM DUAL ) where ( upper(vehiclegroupcode) like upper('%'||:0||'%') 
            or UPPER (description) LIKE UPPER ('%'||:0||'%')
            )
  ORDER BY   vehiclegroupcode`

module.exports = VehicleGroup