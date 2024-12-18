const Period = `select periodctlid "periodctlid",accyear ||' - '|| periodseq "Period", to_char(startdate,'YYYY - Month') "description" from periodctlmst 
where ( upper(periodctlid) like upper('%'||:0||'%')  or UPPER (accyear) LIKE UPPER ('%'||:0||'%') ) order by periodctlid DESC`

module.exports = Period