const Supplier = `SELECT suppliercode "suppliercode", suppliername "suppliername", npwp "npwp",contactname_dir "direktur",ktp_dir "ktp_dir", contacttitle "jabatan", phone "phone"
FROM supplier
WHERE     inactivedate IS NULL
     AND (   upper(suppliercode) LIKE upper('%' || :0 || '%')
          OR upper(suppliername) LIKE upper('%' || :0 || '%'))
ORDER BY suppliercode`

module.exports = Supplier

