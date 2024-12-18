const Site = `select comp "code", comp "description" from epms_ustp.field_all where year = 2023 
    and  comp like upper ('%'||:0||'%') group by comp`

module.exports = Site
