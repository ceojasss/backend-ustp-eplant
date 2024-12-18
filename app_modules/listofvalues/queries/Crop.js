const Crop = `SELECT  cropcode "code",description "description"
FROM crop where 
(   (cropcode) LIKE UPPER ('%' || :0 || '%')
      OR (description) LIKE UPPER ('%' || :0 || '%'))
ORDER BY cropcode`
          
module.exports = Crop
