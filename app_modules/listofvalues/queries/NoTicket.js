const Ticket = `
SELECT   noticket "noticket",
         nospb "nospb",
         drivername "drivername",
         NVL (REGEXP_SUBSTR (nospb,
                             '[^.]+',
                             1,
                             3), 'N/A')
            "kbn",
         NVL (REGEXP_SUBSTR (nospb,
                             '[^.]+',
                             1,
                             4), 'N/A')
            "afd",
         x.nokendaraan "nokendaraan",
         x.beratbersih "beratbersih",
         jumlahjanjang "jumlahjanjang",
         tahuntanam "tahuntanam",
         blok "blok"
  FROM   wbticket x, sortasiheaderwb y
 WHERE       x.noticket = y.nomorsortasi(+)
         AND tglmasuk = to_date(:1,'DD/MM/YYYY')                                    --:p_date
         AND jenismuatan = 'FFB'
         AND (noticket like upper ('%'||:0||'%'))
         ORDER by noticket`

module.exports = Ticket