const MstPerencananIntrans = `SELECT tid                 "id",
to_char(TDATE,'dd-mm-yyyy')              "tdate",
GANGCODE           "gangcode",
MANDORECODE        "mandorecode",
MANDORENAME        "mandorename",
MANDORE1CODE       "mandore1code",
MANDORE1NAME       "mandore1name",
LOCATIONTYPE       "locationtype",
LOCATIONCODE       "locationcode",
JOBCODE            "jobcode",
JOBDESCRIPTION     "jobdescription",
UOM                "uom",
INPUTBY            "inputby",
INPUTDATE          "inputdate",
STATUSPN           "statuspn",
STUPLOAD           "stupload",
VEHICLECODE        "vehiclecode",
TID                "tid",
LOCATIONCODE_ORIGINAL	"locationcode_original"	,	
LOADTYPECODE	"loadtypecode"		,
LOADTYPECODEDESC "loadtype_description"		,
KETERANGAN	"keterangan"		,
UNITOFMEASURECODE	"unitofmeasurecode"		,
UNITOFMEASURECODEDESC	"unitofmeasuredesc"		
FROM masterperencanaanintrans_ori
WHERE VEHICLECODE = :1 AND TDATE =  to_date(:2,'dd-mm-yyyy')`

module.exports = MstPerencananIntrans

