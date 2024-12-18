const UserProfile = `select loginid, fullname, department, email, positionjob, usertype from userprofile
where inactivedate IS NULL AND ( upper(loginid) like upper('%'||:0||'%') )`

module.exports = UserProfile
