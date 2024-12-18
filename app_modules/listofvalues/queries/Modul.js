const Modul = `select to_char(code) "code",name "name" from module 
where ( upper(name) like upper('%'||:0||'%') )
order by name
`

module.exports = Modul
