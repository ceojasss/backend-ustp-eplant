const Locationtype = `SELECT l.locationtypecode  "locationtypecode",l.locationtypename "description"
FROM locationtype l,
     (SELECT DISTINCT SOURCE, TARGET
        FROM activity_location_control
       WHERE SOURCE = :1
       ) a
WHERE     (   UPPER (l.locationtypecode) LIKE UPPER (:0 || '%')
          OR UPPER (l.locationtypename) LIKE UPPER (:0 || '%'))
      AND     
      ((:2='0' AND l.locationtypecode='ST' ) OR (:2!='0' AND l.locationtypecode<>'ST' )) 
      AND a.TARGET = l.locationtypecode 
ORDER BY l.locationtypecode`

module.exports = Locationtype