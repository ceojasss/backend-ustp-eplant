const Location = `

SELECT 
locationtype "locationtype",
locationcode "locationcode",
jobcode "jobcode",
quantity "quantity"
FROM mrdetails_nursery md, mr_nursery m
WHERE     NOT EXISTS
(SELECT *
FROM siv_nursery o
WHERE  o.mrcode = md.mrcode)
AND md.mrcode = :1
and ( locationtype like upper('%'||:0||'%') or locationcode like upper('%'||:0||'%') )
and md.mrcode =m.mrcode`

module.exports = Location
