const BarangAtk = `select 
itemcode,
itemdescription,
lifetimeuom
from purchaseitem where ( upper(itemcode)) like 'Z01%' AND itemcode 
LIKE ('%' || :0 || '%') and inactivedate is null order by itemdescription`

module.exports = BarangAtk