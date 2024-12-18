const Quarry = `select blockid "blockid", description "description" from blockmaster where blockid like upper ('%'||:0||'%')`

module.exports = Quarry
