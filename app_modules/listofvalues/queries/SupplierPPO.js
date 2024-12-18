const Supplier = `SELECT   suppliercode "suppliercode",
suppliername "suppliername",
npwp "npwp",
CASE
   WHEN kuasa_nama IS NOT NULL
   THEN
      TRIM (contactname_opr)
   WHEN kuasa_nama IS NULL AND TRIM (AKTA_UPD_DIREKTUR) IS NOT NULL
   THEN
      TRIM (AKTA_UPD_DIREKTUR)
   WHEN kuasa_nama IS NULL AND TRIM (AKTA_UPD_DIREKTUR) IS NULL
   THEN
      NVL(TRIM (AKTA_DIREKTUR),CONTACTNAME_DIR)                
END
   "Direktur",
CASE
   WHEN kuasa_nama IS NOT NULL
   THEN
      TRIM (kuasa_ktp)
   WHEN kuasa_nama IS NULL AND TRIM (AKTA_UPD_DIREKTUR) IS NOT NULL
   THEN
      TRIM (ktp_dir)
   WHEN kuasa_nama IS NULL AND TRIM (AKTA_UPD_DIREKTUR) IS NULL
   THEN
      TRIM (ktp_dir)
END
   "ktp_dir",
CASE
   WHEN kuasa_nama IS NOT NULL
   THEN
      'Kuasa Direktur'
   WHEN kuasa_nama IS NULL AND TRIM (AKTA_UPD_DIREKTUR) IS NOT NULL
        AND (   suppliername LIKE 'PT%'
             OR suppliername LIKE 'CV%'
             OR suppliername LIKE 'UD%'
             OR suppliername LIKE 'TOKO%'
             OR suppliername LIKE 'BENGKEL%')
   THEN
      'Direktur'
   WHEN kuasa_nama IS NULL AND TRIM (AKTA_UPD_DIREKTUR) IS NULL
        AND (   suppliername LIKE 'PT%'
             OR suppliername LIKE 'CV%'
             OR suppliername LIKE 'UD%'
             OR suppliername LIKE 'TOKO%'
             OR suppliername LIKE 'BENGKEL%')
   THEN
      'Direktur'
   ELSE
      'Pemilik'
END
   "jabatan",
phone "phone"
FROM   supplier
WHERE   inactivedate IS NULL
AND (UPPER (suppliercode) LIKE UPPER ('%' || :0 || '%')
     OR UPPER (suppliername) LIKE UPPER ('%' || :0 || '%'))
ORDER BY   suppliercode`

module.exports = Supplier

