const Stockgroup = `select groupcode "groupcode", GROUPDESCRIPTION "groupdescription",CONTROLJOB "controlaccount", jobdescription "controlaccountdesc"
from stockgroup x, job j
where controljob = jobcode
and substr(groupcode,1,2) not in ('01','02','03','04','05','06','07','08','09','99','77') and groupcode like ('%'||:0||'%')
order by groupcode`

module.exports = Stockgroup

