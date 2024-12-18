const GroupMachine = `select groupcode "code", description "description" from MACHINEGROUP
where (upper(groupcode) like upper('%'||:0||'%') or upper(description) like upper('%'||:0||'%'))  
order by groupcode`

module.exports = GroupMachine


