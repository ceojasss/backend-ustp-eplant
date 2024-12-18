const query = require("./DatabaseHandler");
const router = require("express").Router();
const connection = require('../../../../../mysql/dbCredentials');
const { FeatureCollection, Feature } = require('geojson');
const { point } = require('@turf/helpers');

const _ = require("lodash")


// with oracle
async function get(req, res, next) {
  await query.fetchData(req.user, _.split(req.baseUrl, '/')[3], req.query, (error, result) => {
    if (error) {
      return next(error)
    }
    res.send(result);

  })
}


async function getMap(req, res, next) {
  try {
    const user = req.user;
    const baseUrlSplit = req.baseUrl.split('/');
    const data = req.query;

    const result = await query.fetchMap(user, baseUrlSplit[3], data);
    // console.log('geojson result = ', result);

    const geoJson = convertToGeoJSON(result);
    res.json(geoJson);
    
    console.log('geojson check', geoJson);
  } catch (error) {
    next(error);
  }
}

// with convert to geojson
function convertToGeoJSON(rows) {
  console.log('rows:', rows); // Check the value of 'rows'

  
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

module.exports = {
  get, getMap
};
// with mysql
// async function getMap(req, res, next) {
//   try {
//     const user = req.user;
//     const baseUrlSplit = req.baseUrl.split('/');
//     const data = req.query;

//     const result = await query.fetchMap(user, baseUrlSplit[3], data, (error, result) => {
//       if (error) {
//         return next(error)
//       }
//       res.send(result);

//     });
    
//     // if (!result) {
//     //   throw new Error('No data found');
//     // }

//     const geoJson = convertToGeoJSON(result);
//     res.json(geoJson);

//     console.log('get geojson', geoJson);
//   } catch (error) {
//     next(error);
//   }
// }

// async function getMap(req, res, next) {
//   try {
//     const user = req.user;
//     const baseUrlSplit = req.baseUrl.split('/');
//     const data = req.query;

//     const result = await query.fetchMap(user, baseUrlSplit[3], data, (error, result) => {
//       if (error) {
//         return next(error)
//       }
//       res.send(result);
      

//     });

//     console.log('geojson result = ',result);


//     const geoJson = convertToGeoJSON(result);
//     res.json(geoJson);

//     console.log('geojson check',geoJson);

   
//   } catch (error) {
//     next(error);
//   }

  
// }




// with mysql
// async function getMap(req, res, next) {
//   try {
//     const user = req.user;
//     const baseUrlSplit = req.baseUrl.split('/');
//     const data = req.query;

//     const result = await query.fetchMap(user, baseUrlSplit[3], data);
//     const geoJson = convertToGeoJSON(result);
//     res.json(geoJson);

//     console.log('get geojson', geoJson);
//   } catch (error) {
//     next(error);
//   }
// }




// // with convert to geojson
// function convertToGeoJSON(rows) {
//   console.log('rows:', rows); // Check the value of 'rows'

//   const features = rows.map(row => {
//     return {
//       type: 'Feature',
//       geometry: {
//         type: row.tipe,
//         coordinates: JSON.parse(row.kordinat)
//       },
//       properties: {
//         TYPE: row.tipe,
//         BLOK: row.blok,
//         KEBUN: row.kebun,
//         AFDELING: row.afdeling,
//         properties: row.properties,
//         SITE: row.site,
//         MAPS: row.maps,
//         STREET: row.street,
//         SLENGTH: row.slength,
//         WARNA: row.warna
//       }
//     };
//   });

//   const geoJSON = {
//     type: 'FeatureCollection',
//     features: features
//   };

//   return geoJSON;
// }







