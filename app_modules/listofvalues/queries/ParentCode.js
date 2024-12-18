const ParentCode = `Select
fixedassetcode"code",
assetname"description" from
fafixedasset
where FIXEDASSETCODE<>:1
and
(upper (fixedassetcode)  like upper ('%'||:0||'%') OR
    upper (assetname) like upper ('%'||:0||'%'))`
module.exports=ParentCode
