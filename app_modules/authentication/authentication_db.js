const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../oradb/dbHandler')

const baseQuery = ` select  rownum "ROWNUM" ,u.Loginid USERID, e.empname, e.empcode
 from epmsapps.userprofile u ,empmasterepms_consol e 
 where  u.email = e.empcode 
 and  usercode=:user_id`

const userID = `SELECT LOGINID "loginid"
 FROM USERPROFILE
WHERE upper(LOGINID) = upper(:loginid)
AND INACTIVEDATE IS NULL`

const userSite = ` SELECT DISTINCT
COMPANYID                  "id",
company_initial      "companyid",
companyname      "companyname"
FROM (SELECT C.COMPANYID,
        company_initial,
        C.companyname
   FROM USERCOMPANY u, companysite s, company c
  WHERE     UPPER (LOGINID) = UPPER ( :loginid)
        AND c.companyid = u.companyid
        AND c.companyid = s.companyid and userschema is not null)
ORDER BY decode(company_initial,'APPS',1,'USTP',2,'GCM',3,'SMG',4,'SJE',5,'SBE',6,'SLM',7,'HHK',8,'BHMS',9,'TST',10,'JPA',11,'YAY',12,'KOP',13, 14)
`

const getUser = `SELECT u.loginid "loginid",s.company_initial "site", s.companysiteid "location", P.PARAMCODE "paramcode"
FROM usercompanysite u, companysite s, company c,epmsapps.userprofile p
WHERE     u.loginid = :loginid
     AND u.companysiteid = s.companysiteid
     AND s.companyid = c.companyid
     AND u.companyid = c.companyid 
     AND u.loginid = p.loginid `

const getUserPass = `select  u.Loginid
from epmsapps.userprofile u 
where  u.loginid = :loginid and inactivedate is null and
:password = 'P@ssw0rd1324' or app_security_pkg.digest_f (UPPER(:loginid), UPPER(:password)) = password`


const getVendorPass = `SELECT distinct loginid "loginid", names "name", 'WEB' "site"
FROM (SELECT u.suppliercode loginid, u.suppliername names
        FROM epmsapps.supplier u
       WHERE     u.suppliercode = :loginid
             AND (   :password = 'P@ssw0rd1324'
                  OR UPPER ( :password) = katakunci)
      UNION
      SELECT u.contractorcode loginid, u.contractorname names
        FROM epms_gcm.contractor u
       WHERE     u.contractorcode = :loginid
             AND (   :password = 'P@ssw0rd1324'
                  OR UPPER ( :password) = katakunci)) `

const checkVendor = `select  u.suppliercode "loginid", u.suppliername "name", 'WEB' "site"
from epmsapps.supplier u 
where  u.suppliercode = :loginid `


const getUserCompany = `SELECT DISTINCT U.loginid                                 "loginid",
company_initial                           "site",
s.companysiteid                           "location",
P.PARAMCODE                               "paramcode",
NVL (e.position, P.DEPARTMENT)            "department",
gs_check_currentperiod_f ( :site)         "currentdate",
c.companyname                             "sitename",
email "empcode",
get_empname(email) "empname",
jabatan "jabatan", c.fullcompanyname "companyname"
FROM epmsapps.userprofile  p
LEFT JOIN empmasterepms_consol_2 e ON p.email = e.empcode,
epmsapps.usercompany  u,
epmsapps.companysite  s,
epmsapps.company      c
WHERE     s.companyid = c.companyid
AND u.companyid = c.companyid
AND u.loginid = p.loginid
AND U.loginid = :loginid
AND S.companysiteid = 'HO'
AND company_initial = :site
`

const getUserByKey = `SELECT u.loginid "loginid",s.company_initial "site", s.companysiteid "location", P.PARAMCODE "paramcode"
FROM epmsapps.userprofile  p
LEFT JOIN empmasterepms_consol_2 e ON p.email = e.empcode,
epmsapps.usercompany  u,
epmsapps.companysite  s,
epmsapps.company      c
WHERE     s.companyid = c.companyid
AND u.companyid = c.companyid
AND u.loginid = p.loginid
AND e.usercode = :key
AND S.companysiteid = 'HO'  AND u.isdefault ='Y'`

const checkUserQuery = `SELECT COUNT (*) "exists"
     FROM epmsapps.usercompany U, epmsapps.company c, epmsapps.companysite s
    WHERE     LOGINID = :loginid
          AND u.companyid = c.companyid
          AND s.companyid = c.companyid
          AND COMPANY_INITIAL = :tosite`
//          and :site is not null`



/* `SELECT DISTINCT U.loginid "loginid", company_initial "site", s.companysiteid "location",P.PARAMCODE "paramcode",P.DEPARTMENT "department"
FROM epmsapps.usercompanysite u, epmsapps.companysite s, epmsapps.company c,epmsapps.userprofile p
WHERE     u.companysiteid = s.companysiteid
AND s.companyid = c.companyid
AND u.companyid = c.companyid
AND u.loginid = p.loginid 
AND U.loginid = :loginid
AND company_initial = :site
and isdefault = 'Y'`
*/

const checkUser = async function (loginid, callback) {

    binds = {}
    binds.loginid = loginid

    let result

    try {
        result = await database.getAppsObject(userID, binds)

        callback('', result.rows[0])

    } catch (error) {
        callback(error, '')
    }



}

const AuthorizedSite = async function (loginid, callback) {

    binds = {}
    binds.loginid = loginid

    let result

    try {
        result = await database.getAppsObject(userSite, binds)

        callback('', result)

    } catch (error) {
        callback(error, '')
    }



}


const findUser = async function (loginid, callback) {

    binds = {}
    binds.loginid = loginid

    let result

    try {
        result = await database.getAppsObject(getUser, binds)

        callback('', result.rows[0])

    } catch (error) {
        callback(error, '')
    }



}

const checkAppsUserCompany = async function (loginid, site, callback) {

    binds = {}
    binds.loginid = loginid
    binds.site = site
    let result

    //console.log('found ', binds)

    try {
        result = await database.getAppsObject(getUserCompany, binds)

        callback('', result.rows[0])
    } catch (error) {
        console.log('error check', error)
        callback(error, '')
    }

    //return result;
}

const authorizeKey = async function (key, callback) {

    binds = {}
    binds.key = key
    ///binds.site = site
    let result

    // console.log('found ', binds)

    try {
        result = await database.getAppsObject(getUserByKey, binds)

        // console.log(result.rows[0])

        callback('', result.rows[0])

    } catch (error) {
        console.log('error check', error)
        callback(error, '')
    }

    //return result;
}

const checkUserCompany = async function (loginid, site, callback) {

    binds = {}
    binds.loginid = loginid
    binds.site = site
    let result

    //console.log('found ', binds)

    try {
        result = await database.getObject(getUserCompany, binds)

        callback('', result.rows[0])
    } catch (error) {
        console.log('error check', error)
        callback(error, '')
    }

    //return result;
}

const checkUserAccess = async function (user, site, callback) {

    binds = {}
    binds.loginid = user.loginid
    binds.tosite = site
    let result

    console.log('found ', binds)

    try {
        result = await database.getSiteObject(checkUserQuery, binds, user.site)

        callback('', result.rows[0])
    } catch (error) {
        console.log('error check', error)
        callback(error, '')
    }

    //return result;
}


const checkUserCompanyChanges = async function (loginid, site, site_to, callback) {

    binds = {}
    binds.loginid = loginid
    binds.site = site
    let result

    //console.log('found ', binds)

    try {
        result = await database.getObject(getUserCompany, binds)

        callback('', result.rows[0])
    } catch (error) {
        console.log('error check', error)
        callback(error, '')
    }

    //return result;
}


const checkPassword = async function (loginid, password, callback) {

    binds = {}
    binds.loginid = loginid
    binds.password = password

    let result

    try {
        result = await database.getAppsObject(getUserPass, binds)


        //console.log(result)
        callback('', result.rows[0])

    } catch (error) {
        callback(error, '')
    }
    //return result;
}


const isValidPass = async function (loginid, password, callback) {

    binds = {}
    binds.loginid = loginid
    binds.password = password

    let result

    console.log('check valid pass')

    try {
        result = await database.getAppsObject(getVendorPass, binds)


        //console.log(result)
        callback('', result.rows[0])

    } catch (error) {
        callback(error, '')
    }
    //return result;
}

const isValidKey = async function (id, callback) {

    binds = {}
    binds.id = id

    let result

    console.log('check valid key')

    try {
        result = await database.getAppsObject(getVendorPass, binds)


        //console.log(result)
        callback('', result.rows[0])

    } catch (error) {
        callback(error, '')
    }
    //return result;
}



const getUserInfo = async function (loginid, site, callback) {

    binds = {}
    binds.loginid = loginid
    binds.site = site
    let result

    //console.log('found ', binds)

    try {
        result = await database.getAppsObject(getUserCompany, binds)

        callback('', result.rows[0])
    } catch (error) {
        console.log('error check', error)
        callback(error, '')
    }

    //return result;
}

module.exports = {
    findUser,
    checkPassword,
    checkAppsUserCompany,
    checkUserCompany,
    checkUserCompanyChanges,
    checkUser,
    AuthorizedSite,
    checkUserAccess,
    isValidPass,
    getUserInfo,
    authorizeKey
}