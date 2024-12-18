const Loctype = `SELECT l.locationtypecode "locationtypecode", l.locationtypename "description"
    FROM locationtype l,
         (SELECT DISTINCT SOURCE, TARGET
            FROM activity_location_control
           WHERE SOURCE = :0) a
   WHERE      a.TARGET = l.locationtypecode
ORDER BY l.locationtypecode`

module.exports = Loctype