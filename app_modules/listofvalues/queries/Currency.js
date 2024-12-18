const baseQuery = `SELECT currid "currid", currdesc "currdesc" FROM currencymst where currid like ('%'||:0||'%') `

module.exports = baseQuery