const Ruangan = `select kode "code", nama "description" from FARUANGAN
where ( upper(kode) like upper('%'||:0||'%') or UPPER (nama) LIKE UPPER ('%'||:0||'%')) order by kode`

module.exports = Ruangan