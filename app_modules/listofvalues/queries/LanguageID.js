const LanguageOral = `select  lang_id "code" ,language "description" from ref_language
    where lang_id like upper ('%'||:0||'%') and language like upper ('%'||:0||'%')`

module.exports = LanguageOral
