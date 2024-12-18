const Account = `SELECT JOBCODE "jobcode", JOBDESCRIPTION "description",UNITOFMEASURE "uom"
FROM job
WHERE     inactivedate IS NULL AND grouptype = 'D' 
     and ( upper(jobcode) like upper('%'||:0||'%') or UPPER (JOBDESCRIPTION) LIKE UPPER ('%'||:0||'%'))
     order by JOBCODE`

module.exports = Account