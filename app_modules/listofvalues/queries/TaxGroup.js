const TaxGroup = `select
taxgroup"code",
groupname"description"
from fataxgroup
where
upper (taxgroup) like upper ('%'||:0||'%')`

module.exports = TaxGroup