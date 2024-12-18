const router = require("express").Router();

const prod = require("./Prod/Controller");
const bgt = require("./Bgt/Controller");
const rawat = require("./Rawat/Controller");
const panen = require("./Panen/Controller");
const actbgt = require("./ActBgt/Controller");
const alatberat = require("./AlatBerat/Controller");
const cpo = require("./CPO/Controller");
const dumptruck = require("./DumpTruck/Controller");
const ker = require("./Ker/Controller");
const kernel = require("./Kernel/Controller");
const oer = require("./Oer/Controller");
const rotasipanen = require("./RotasiPanen/Controller");

router.route(`/prod`).get(prod.get);

router.route(`/bgt`).get(bgt.get);

router.route(`/rawat`).get(rawat.get);

router.route(`/panen`).get(panen.get);

router.route(`/actbgt`).get(actbgt.get);

router.route(`/alatberat`).get(alatberat.get);

router.route(`/cpo`).get(cpo.get);

router.route(`/dumptruck`).get(dumptruck.get);

router.route(`/ker`).get(ker.get);

router.route(`/kernel`).get(kernel.get);

router.route(`/oer`).get(oer.get);

router.route(`/rotasipanen`).get(rotasipanen.get);

module.exports = router;
