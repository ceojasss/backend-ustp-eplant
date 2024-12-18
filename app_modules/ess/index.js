const router = require('express').Router();
const spkl = require('./Spkl/Controller')
const pengajuanatk = require('./PengajuanAtk/Controller')
const rekapabsensisemuakaryawan = require("./RekapAbsensiSemuaKaryawan/Controller");
const suratperjalanandinas = require("./SuratPerjalananDinas/Controller");
const historyspd = require("./HistorySpd/Controller");
const izin = require('./Izin/Controller')
const dayoff = require("./DayOff/Controller");

router.route(`/izin`)
    .get(izin.get)
    .post(izin.post)
    .put(izin.update)
    .delete(izin.hapus)
    
    
router.route(`/spkl`)
    .get(spkl.get)
    .post(spkl.post)
    .put(spkl.update)
    .delete(spkl.hapus)


router.route(`/pengajuanatk`)
    .get(pengajuanatk.get)
    .post(pengajuanatk.post)
    .put(pengajuanatk.update)
    .delete(pengajuanatk.hapus)

router.route(`/rekapabsensisemuakaryawan`)
    .get(rekapabsensisemuakaryawan.get);


router.route(`/suratperjalanandinas`)
    .get(suratperjalanandinas.get)
    .post(suratperjalanandinas.post)

router.route(`/suratperjalanandinas/detail`)
    .get(suratperjalanandinas.getDetail)

router.route(`/historyspd`)
    .get(historyspd.get);

    
router.route(`/dayoff`)
    .get(dayoff.get)
    .post(dayoff.post)
    .put(dayoff.update)
    .delete(dayoff.hapus);
  
module.exports = router;
