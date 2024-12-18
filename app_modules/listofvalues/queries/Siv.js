const Siv = `select sivcode "code" from siv
where sivcode like upper('%'||:0||'%') order by sivcode`

module.exports = Siv