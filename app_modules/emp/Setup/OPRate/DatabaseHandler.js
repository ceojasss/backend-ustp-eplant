const _ = require("lodash");
const database = require("../../../../oradb/dbHandler");

const baseQuery = `SELECT   rowid "rowid",
fieldgroup "fieldgroup",
harvclass  "harvclass",
remarks "remarks",
plantingyear "plantingyear",
basicunits "basicunits",
basicassignmentamt "basicassignmentamt",
amttier1_min "amttier1_min",
amttier1_max "amttier1_max",
amttier1_rate "amttier1_rate",
amttier2_min "amttier2_min",
amttier2_max "amttier2_max",
amttier2_rate "amttier2_rate",
amttier3_min "amttier3_min",
amttier3_max "amttier3_max",
amttier3_rate "amttier3_rate",
lf "lf",
bonus "bonus",
hlbasicunits "hlbasicunits",
hlbasicassignmentamt "hlbasicassignmentamt",
hlamttier1_min "hlamttier1_min",
hlamttier1_max "hlamttier1_max",
hlamttier1_rate "hlamttier1_rate",
hlamttier2_min "hlamttier2_min",
hlamttier2_max "hlamttier2_max",
hlamttier2_rate "hlamttier2_rate",
hlamttier3_min "hlamttier3_min",
hlamttier3_max "hlamttier3_max",
hlamttier3_rate "hlamttier3_rate",
hllf "hllf",
hlbonus "hlbonus",
jobcode "jobcode",
bunchperhk "bunchperhk",
alldedcode "alldedcode",
comp_id "comp_id",
site_id "site_id",
inputby "inputby",
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate",
abw1 "abw1",
abw2 "abw2",
basicunits2 "basicunits2",
basicunits3 "basicunits3",
basicunits4 "basicunits4"
FROM empoprate 
ORDER BY fieldgroup
`;

const fetchdata = async function (users, route, callback) {
  binds = {};

  let result;

  // console.log(route)

  try {
    result = await database.siteWithDefExecute(users, route, baseQuery, binds);
    //console.log(result)
  } catch (error) {
    callback(error, "");
  }

  callback("", result);
};

module.exports = {
  fetchdata,
};
