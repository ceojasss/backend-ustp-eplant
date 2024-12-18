const agreementcontract = ` select a.agreementcode "code" from lpocontract a where to_date(:1,'dd-mm-yyyy') BETWEEN a.startdate AND a.enddate and suppliercode=:2 and (agreementcode like upper ('%'||:0||'%') OR suppliercode like upper ('%'||:0||'%')) order by agreementcode`

module.exports = agreementcontract