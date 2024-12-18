const Housing = `select ifcode "ifcode", ifname "ifname" from v_housing
where ( upper(ifcode) like upper('%'||:0||'%') or UPPER (ifname) LIKE UPPER ('%'||:0||'%')) order by ifcode`

module.exports = Housing