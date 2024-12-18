const Contractor = `select contractorcode "code",
contractorname ||' - '||npwp "description" 
from contractor where inactivedate is null 
and ( contractorcode like UPPER ('%'||:0||'%')  
OR contractorname like UPPER ('%'||:0||'%')
)
order by contractorcode
`

module.exports = Contractor