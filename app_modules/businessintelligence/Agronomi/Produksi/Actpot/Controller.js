const _ = require("lodash")
const router = require("express").Router();
const database = require("../../../../../oradb/dbHandler");
const query = require("./DatabaseHandler");


async function get(req, res, next) {
  await query.fetchData(req.user, _.split(req.baseUrl, '/')[3], req.query, (error, result) => {
    if (error) {
      return next(error)
    }
    res.send(result);

  })
}

async function getDataMap(req, res, next) {
  try {
    const user = req.user;
    const baseUrlSplit = req.baseUrl.split('/');
    const data = req.query;


    const result = await query.fetchBasicMap(user, baseUrlSplit[3], data);

    let sync

    /*X.KOORDINAT AS "koordinat",
    X.TYPE AS "tYpe",
    X.BLOK AS "blok",
    X.KEBUN AS "kebun",
    X.AFDELING AS "afdeling",
    X.properties AS "properties",
    X.SITE AS "site",
    X.MAPS AS "maps",
    X.STREET AS "street",
    X.SLENGTH AS "slength" */

    const insertstatement = `insert into mst_all_map(KOORDINAT, TYPE, BLOK, KEBUN, AFDELING, PROPERTIES, SITE, MAPS, STREET, SLENGTH) 
    values (:koordinat, :type, :blok, :kebun, :afdeling, :properties, :site, :maps, :street, :slength      ) `

    if (!_.isEmpty(result)) {

      sync = await database.executeStmtMany(user, insertstatement, result)

    }




    res.send({
      job: 'sync map',
      status: 'success',
      site: data.p_site,
      ...sync
    });

    // console.log('geojson check', geoJson);


  } catch (error) {
    next(error);
  }
}

async function getMap(req, res, next) {
  try {
    const user = req.user;
    const baseUrlSplit = req.baseUrl.split('/');
    const data = req.query;

    const result = await query.fetchMap(user, baseUrlSplit[3], data);
    // console.log('geojson result = ', result);

    //    console.log('fetch map result :',result);

    const geoJson = convertToGeoJSON(result);
    res.json(geoJson);

    // console.log('geojson check', geoJson);
  } catch (error) {
    next(error);
  }
}

// with convert to geojson
function convertToGeoJSON(rows) {
  //console.log('rows:', rows); // Check the value of 'rows'


  const features = rows.map(row => {
    return {
      type: 'Feature',
      geometry: {
        type: row.tipe,
        coordinates: JSON.parse(row.kordinat)
      },
      properties: {
        TYPE: row.tipe,
        BLOK: row.blok,
        KEBUN: row.kebun,
        AFDELING: row.afdeling,
        properties: row.properties,
        SITE: row.site,
        MAPS: row.maps,
        STREET: row.street,
        SLENGTH: row.slength,
        WARNA: row.warna
      }
    };
  });

  const geoJSON = {
    type: 'FeatureCollection',
    features: features
  };

  return geoJSON;
}

async function getSingleMap(req, res, next) {
  try {
    const user = req.user;
    const baseUrlSplit = req.baseUrl.split('/');
    const data = req.query;


    const result = await query.fetchRawMap(user, baseUrlSplit[3], data);

    let sync

    /*X.KOORDINAT AS "koordinat",
    X.TYPE AS "tYpe",
    X.BLOK AS "blok",
    X.KEBUN AS "kebun",
    X.AFDELING AS "afdeling",
    X.properties AS "properties",
    X.SITE AS "site",
    X.MAPS AS "maps",
    X.STREET AS "street",
    X.SLENGTH AS "slength" */

    /* const insertstatement = `insert into mst_all_map(KOORDINAT, TYPE, BLOK, KEBUN, AFDELING, PROPERTIES, SITE, MAPS, STREET, SLENGTH) 
    values (:koordinat, :type, :blok, :kebun, :afdeling, :properties, :site, :maps, :street, :slength      ) `
 */
    /*     if (!_.isEmpty(result)) {
    
          sync = await database.executeStmtMany(user, insertstatement, result)
    
        }
     */

    const insertstatement = `insert into mst_raw_map(site, blockid, koordinat) 
        values ( :site, :blok, :geometry) `


    if (!_.isEmpty(result)) {

      sync = await database.executeStmtMany(user, insertstatement, result)

    }

    res.send({
      job: 'sync map',
      status: 'success',
      site: data.p_site
    });

    // console.log('geojson check', geoJson);


  } catch (error) {
    next(error);
  } finally {
    // to do
  }
}


module.exports = {
  get, getMap, getDataMap, getSingleMap
};