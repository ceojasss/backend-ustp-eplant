const router = require("express").Router();

// const query = require("./Query/Controller");
const arealstatement = require("./Produksi/ArealStatement/Controller");
const produksiharian = require("./Produksi/ProduksiHarian/Controller");
const produksibulanan = require("./Produksi/ProduksiBulanan/Controller");
const produksibulanandetail = require("./Produksi/ProduksiBulananDetail/Controller");
const yieldbyage = require("./Produksi/Yieldbyage/Controller");
const yieldpotensi = require("./Produksi/Yieldpotensi/Controller");
const actbudget = require("./Produksi/ActBudget/Controller");
const actpot = require("./Produksi/Actpot/Controller");

router.route(`/arealstatement`)
    .get(arealstatement.get);

router.route(`/produksiharian`)
    .get(produksiharian.get);

router.route(`/produksibulanan`)
    .get(produksibulanan.get);

router.route(`/produksibulanandetail`)
    .get(produksibulanandetail.get);

router.route(`/yieldbyage`)
    .get(yieldbyage.get);

router.route(`/yieldpotensi`)
    .get(yieldpotensi.get);

router.route(`/actbudget`)
    .get(actbudget.get);

router.route(`/actbudget/map`)
    .get(actbudget.getMap);

router.route(`/actpot`)
    .get(actpot.get);

router.route(`/actpot/map`)
    .get(actpot.getMap);

router.route(`/actpot/mapdata`)
    .get(actpot.getDataMap);


router.route(`/actpot/rawmap`)
    .get(actpot.getSingleMap);





module.exports = router;