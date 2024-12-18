const _ = require("lodash");
const database = require("../../../../oradb/dbHandler");

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = ` select ROWID "rowid", GROUPID "groupid", DESCRIPTION "description", UNIT "unit", 
DEPRMETHODID "deprmethodid", PERCENTDEPRERATE "percentdeprerate",
FIXEDASSETACCOUNT "fixedassetaccount", ACUMDEPRECIATACCOUNT "acumdepreciataccount",
CIPACCOUNTCODE "cipaccountcode", GROUPPARENT "groupparent", 
INPUTDATE "inputdate", INPUTBY "inputby", UPDATEDATE "updatedate", 
ISDEPRECIABLE "isdepreciable", UPDATEBY "updateby", INACTIVEMARK "inactivemark",
SALESPROCEED "salesproceed", COSTREMOVAL "costremoval", 
DEPRECIATIONDIFFERENT "depreciationdifferent", 
DEPREXPACCOUNT "deprexpaccount", NBRETIREACCOUNT "nbretireaccount" from fagroup`;

const tableQuery = `modulecode	"modulecode",
submodulecode	"submodulecode",
formname	"formname",
blockname	"blockname",
itemname	"itemname",
subitemname	"subitemname",
itemtype	"itemtype",
prompt_eng	"prompt_eng",
prompt_ina	"prompt_ina",
prompt_jpn	"prompt_jpn",
label_eng	"label_eng",
label_ina	"label_ina",
label_jpn	"label_jpn",
radioprompt	"radioprompt",
required	"required",
msg_id	"msg_id",
seq_order	"seq_order", 
lovs "lovs"
from apps_component`;

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
