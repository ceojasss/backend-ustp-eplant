const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')



// const baseQuery = ` select b.ROWID "rowid",b.CONCESSIONID "concessionid", l.description "descconcessiondisplayonly", NOHGU "nohgu#code", BLOCKID "blockid",
// b.DESCRIPTION "description", SOILTYPE "soiltype", TOPOGRAPH "topograph", b.HECTARAGE "hectarage",
//  PLANTABLE "plantable", UNPLANTABLE "unplantable", INACTIVE "inactive", to_char(INACTIVEDATE,'dd-mm-yyyy') "inactivedate",
//   b.COMP_ID "comp_id", b.SITE_ID "site_id", PLANTED "planted", UNPLANTED "unplanted", NONEFECTIVE "nonefective",
//    VEGETATION "vegetation", b.inputby "inputby",to_char(b.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", b.updateby "updateby", to_char(b.updatedate,'dd-mm-yyyy hh24:mi') "updatedate", SOILCLASS "soilclass", SOILCATEGORY "soilcategory",
//      ACREAGE_CLEARED "acreage_cleared", INTIPLASMA "intiplasma", LANDTEXTURE "landtexture",
//       CROPPOLICY "croppolicy", TOPOGRAPH_MAP "topograph_map" from blockmaster b, landconcession l where l.CONCESSIONID = b.CONCESSIONID `


      const baseQuery = `select  b.ROWID "rowid",
      a.FIELDCODE "fieldcodedisplayonly",
      l.DESCRIPTION "descconcessiondisplayonly", 
      b.BLOCKID "blockid",
      b.CONCESSIONID "concessionid", 
      b.NOHGU "nohgu",
      a.REFF_FIELDCODE"reff_fieldcodedisplayonly",
      a.ESTATECODE"estatecodedisplayonly",
      a.DIVISIONCODE"divisioncode",
      a.CROPTYPE"croptypedisplayonly",
      a.DIVISIONCODE_PLASMA"divisioncodeplasmadisplayonly",
      a.HECTPLANTED "hectplanteddisplayonly",
      to_char(a.PLANTINGDATE,'dd-mm-yyyy')"plantingdatedisplayonly",
      a.PLANTINGDISTANCE"plantingdistancedisplayonly",
      to_char(a.HARVCOMMDATE,'dd-mm-yyyy')"harvcommdatedisplayonly",
      to_char(a.FIRSTHARVEST,'dd-mm-yyyy')"firstharvestdisplayonly",
      to_char(a.DATE_OF_REPLANT_FINISH,'dd-mm-yyyy')"dateofreplantfinishdisplayonly",
      to_char(a.REPLANTING_DATE,'dd-mm-yyyy')"replantingdatedisplayonly",
      a.STANDPERHECT"standperhectdisplayonly",
      a.BREEDER"breederdisplayonly",
      a.PLANTINGPOINTNUM"plantingpointnumdisplayonly",
      a.PRODCTIVEORIGINAL"prodctiveoriginaldisplayonly",
      a.PRODUCTIVESUPPLIYING"prodsuppliyingdisplayonly",
      a.UNPRODUCTIVE"unproductivedisplayonly",
      a.UNPRODUCTIVESUPPLIYING"unprodsuppdisplayonly",
      a.JUMLAHPOKOK"jmlpkkdisplayonly",
      a.ABNORMALDOYONG"abdoyongdisplayonly",
      a.ABNORMALTREES"abnormaltreesdisplayonly",
      a.DEADTREES"deadtressdisplayonly",
      a.EMPTYHOLE"emptyholedisplayonly",
      a.LA"ladisplayonly",
      a.BMP"bmpdisplayonly",
      a.TANKOS "tankosdisplayonly",
      a.FREQ_TANKOS"freqtankosdisplayonly",
      a.SOLID"soliddisplayonly",
      a.FREQ_SOLID"freqsoliddisplayonly",
      a.TERAS"terasdisplayonly",
      a.TINGGI_TTK_TANAM"tingttktnmdisplayonly",
      a.POME"pomedisplayonly",
      a.PASIR"pasirdisplayonly",
      a.IRIGASI"irigasidisplayonly",
      b.inputby "inputby",
      to_char(b.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
      b.updateby "updateby", to_char(b.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
      from blockmaster b, landconcession l ,fieldcrop a
      where a.blockid=b.blockid 
      and l.CONCESSIONID = b.CONCESSIONID
      `



    // const baseQuery = `select  b.ROWID "rowid",
    // f.DIVISIONCODE_PLASMA "divisioncode_plasma",
    // l.DESCRIPTION "descconcessiondisplayonly", 
    // b.BLOCKID "blockid",
    // b.CONCESSIONID "concessionid", 
    // b.NOHGU "nohgu",
    // b.inputby "inputby",
    // to_char(b.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
    // b.updateby "updateby", 
    // to_char(b.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
    // from blockmaster b, landconcession l , fieldcrop f
    // where  l.CONCESSIONID = b.CONCESSIONID and b.blockid = f.blockid
    
    
 

    
    
 


    // `



      const fetchdata = async function (users, route, callback) {

        binds = {}
    
        let result
    
        // console.log(route)
    
        try {
            result = await database.siteWithDefExecute(users, route, baseQuery, binds)
    
            //console.log(result)
    
        } catch (error) {
            console.log('db error :', error.message)
    
            callback(error.message, '')
        }
    
        callback('', result)
    }
    
    
    
    
    module.exports = {
        fetchdata
    }
    
    
    