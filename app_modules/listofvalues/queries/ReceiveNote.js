const Receivenote = `SELECT   r.receivenotecode "code",  locationcode "description",rd.quantity "qty",qty_trf "qty_trf"
FROM receivenote r, receivenotedetail rd
LEFT join
    (select a.receivenotecode, sum(b.quantity) qty_trf from transfervoucher a, transferdetails b
    where a.transfercode=b.transfercode
    group by a.receivenotecode ) trf
    on trf.receivenotecode=rd.receivenotecode
WHERE r.receivenotecode = rd.receivenotecode
     AND rd.locationcode = :1
     and nvl(qty_trf,0)<nvl(rd.quantity,0) and  (   (r.receivenotecode) LIKE UPPER ('%' || :0 || '%')
          OR (locationcode) LIKE UPPER ('%' || :0 || '%')) and rownum < 90
order BY rndate DESC
`

module.exports = Receivenote
