const hr_suster = `select id_doctor "id_doctor",doc_name "doc_name" from hr_ref_doctor
where DOC_SPEC = 'SUSTER' and ((id_doctor) like upper ('%'||:0||'%') or (doc_name) like upper ('%'||:0||'%'))  
order by id_doctor`

module.exports = hr_suster


