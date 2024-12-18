const supplierbypo = `  SELECT suppliercode
FROM lpo
WHERE     pocode = :1
     AND NVL ( :0, 'X') = 'X'`

module.exports = supplierbypo