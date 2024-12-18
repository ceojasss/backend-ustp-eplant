const Lpr = `SELECT prcode "code", prnotes "description", to_char(prdate, 'dd-mm-yyyy') "prdate", prrequestfrom "prrequestfrom" FROM lpr 
WHERE ( upper(prcode) like upper('%'||:0||'%') 
          or UPPER (prnotes) LIKE UPPER ('%'||:0||'%')
          or UPPER (prdate) LIKE UPPER ('%'||:0||'%')
          or UPPER (prrequestfrom) LIKE UPPER ('%'||:0||'%'))
     order by prcode`

module.exports = Lpr
