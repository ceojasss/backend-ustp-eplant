const Training = `select  training_id "code", trainingdesc "description" from hr_ref_training
where (  upper(training_id) like upper('%'||:0||'%') or  upper(trainingdesc) like upper('%'||:0||'%') ) order by training_id`

module.exports = Training