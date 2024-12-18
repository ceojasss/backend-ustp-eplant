const baseQuery = `select parametervaluecode "group_item",parametervalue "group_item_desc"
from parametervalue
where parametercode in ('WIP_GROUP')  `

module.exports = baseQuery