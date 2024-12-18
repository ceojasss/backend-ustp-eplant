const SupplierVisit = `SELECT suppliercode "suppliercode", suppliername "suppliername", address "address",
address_ws "address_ws", address_gd "address_gd"
FROM supplier
WHERE     inactivedate IS NULL
     AND (   upper(suppliercode) LIKE upper('%' || :0 || '%')
          OR upper(suppliername) LIKE upper('%' || :0 || '%'))
ORDER BY suppliercode`

module.exports = SupplierVisit

