const Pph = `SELECT taxcode "taxcode", description ||' ('||taxcode ||')' "description"
FROM (SELECT taxcode, description
        FROM taxmaster
       WHERE taxcode LIKE 'PPH%'
      UNION
      SELECT 'N/A', 'N/A' FROM DUAL)
WHERE UPPER (taxcode) LIKE UPPER ('%' || :0 || '%')`

module.exports = Pph