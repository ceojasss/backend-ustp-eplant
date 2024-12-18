const router = require("express").Router();

const lph = require("./LaporanProduksiHarian/Controller")
const lpb = require ("./LaporanProduksiBulanan/Controller")
const rph = require ("./RekapanProduksiHarian/Controller")
const rpb = require ("./RekapanProduksiBulanan/Controller")
///Analisa OER KER////
const gauge =require("./AnalisaOerKer/OerKerFFA/Controller")
const gradffb = require("./AnalisaOerKer/GradingFFB/Controller")
const tabgrading = require("./AnalisaOerKer/TableGrading/Controller")
const breeder =require("./AnalisaOerKer/Breeder/Controller")
const jamtbs= require("./AnalisaOerKer/JamPenerimaan/Controller") 
const umur  =require("./AnalisaOerKer/Umur/Controller")
const gaugetrash  =require("./AnalisaOerKer/BrondolGauge/Controller")
///Analisa OER KER////

//MillCost//
const cost= require("./MillCost/Cost/Controller")
const tbsolah = require ("./MillCost/TbsOlah/Controller")
const costtbsolah =require ("./MillCost/CostTbsOlah/Controller")
const palmprod = require ("./MillCost/PalmProd/Controller")
const costpalmprod =require ("./MillCost/CostPalmProd/Controller")
const olahrawatumum =require ("./MillCost/OlahRawatUmum/Controller")

const biayaumum = require("./MillCost/AlokasiBiayaUmum/Controller")
const biayaumumdetail = require("./MillCost/DetailUmum/Controller")

const biayarawat = require("./MillCost/BiayaPerawatan/Controller")
const biayarawatdetail = require("./MillCost/DetailRawat/Controller")


const biayaolah=require ("./MillCost/BiayaPengolahan/Controller")
const biayaolahdetail=require ("./MillCost/DetailOlah/Controller")


//MillCost//

//MillCostAllSite//
const thismonth = require ("./MillCostAllSite/ThisMonth/Controller")
const todate =require("./MillCostAllSite/ToDate/Controller")
const biayathismonth=require("./MillCostAllSite/BiayaThisMonth/Controller")
const biayayeartodate = require("./MillCostAllSite/BiayaYearToDate/Controller")
//MillCostAllSite//

//MillOverTime//
const tabkerja =require ("./MillOverTime/TableKerja/Controller")
const tabemp = require ("./MillOverTime/TableKaryawan/Controller")
const rankkerja = require("./MillOverTime/RankKerja/Controller")
const rankemp = require("./MillOverTime/RankEmp/Controller")
//MillOverTime//

router.route('/lph').get(lph.get);
router.route('/lpb').get(lpb.get);
router.route('/rph').get(rph.get);
router.route('/rpb').get(rpb.get);
router.route('/gradffb').get(gradffb.get);
router.route('/tabgrading').get(tabgrading.get);
router.route('/breeder').get(breeder.get);
router.route('/jamtbs').get(jamtbs.get);
router.route('/cost').get(cost.get);
router.route('/tbsolah').get(tbsolah.get);
router.route('/costtbsolah').get(costtbsolah.get);
router.route('/palmprod').get(palmprod.get);
router.route('/costpalmprod').get(costpalmprod.get);
router.route('/olahrawatumum').get(olahrawatumum.get);


router.route('/biayaolah').get(biayaolah.get);
router.route('/biayaolahdetail').get(biayaolahdetail.get);
router.route('/biayarawat').get(biayarawat.get);
router.route('/biayarawatdetail').get(biayarawatdetail.get);
router.route('/biayaumum').get(biayaumum.get);
router.route('/biayaumumdetail').get(biayaumumdetail.get);



// router.route('/detailrawat').get(detailrawat.get);
// router.route('/detailumum').get(detailumum.get);



router.route('/thismonth').get(thismonth.get);
router.route('/todate').get(todate.get);
router.route('/biayathismonth').get(biayathismonth.get);
router.route('/biayayeartodate').get(biayayeartodate.get);
router.route('/tabkerja').get(tabkerja.get);
router.route('/tabemp').get(tabemp.get);
router.route('/rankkerja').get(rankkerja.get);
router.route('/rankemp').get(rankemp.get);
router.route('/umur').get(umur.get);
router.route('/gauge').get(gauge.get);
router.route('/gaugetrash').get(gaugetrash.get);


module.exports=router;