const _ = require('lodash')
const axios = require('axios')
const oracledb = require('oracledb');


const HandlerDB = require('./DatabaseHandler')
const { UpdateResultAsync, UpdateResult } = require('../../../../util/HelperUtility')
const dbhandler = require('../../../../oradb/dbHandler')

async function get(req, res, next) {


    await HandlerDB.fetchDataHeader(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {


        if (error) {
            return next(error)
        }


        res.send({
            ...result,
            count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
        })

    })

}

module.exports.get = get;

async function post(req, res, next) {


    binds = {}

    /**
   * ! change the parameters according to the table
   */
    const users = { ...req.user }

    binds.retval = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 3500 }

    binds.module = req.body.code
    binds.period = req.body.period
    binds.user = users.loginid


    let result

    //console.log(users.loginid)

    try {
        const stmt = `DECLARE
            l_RetVal  VARCHAR2 (4000);
            BEGIN

            -- Call
            
            l_RetVal := CLOSING_ALL_WITH_STATUS (:module,:period,:user);

            :retval := l_RetVal;            
            
            EXCEPTION WHEN OTHERS
            THEN
            :retval := 'error '||sqlerrm;
            END; `

        result = await dbhandler.siteExecuteDynamicBinds(users, stmt, binds)


        if (!_.isEmpty(result.outBinds.retval) && result.outBinds.retval.indexOf('success') > -1) {

            res.send('success')

        } else {
            console.log('error db', result.outBinds.retval)

            res.send({ error: true, errorMessage: result.outBinds.retval })

        }
    } catch (error) {

        console.log('error db', error)

        res.send({ error: true, errorMessage: _.isEmpty(error) ? 'Unexpected Error - Unexpected Error -Unexpected Error  ' : error.toString() })
    }

}

module.exports.post = post;


async function exportFaktur(req, res, next) {
    let result;

    const urls = req.body.url
    const users = { ...req.user }


    console.log(urls)

    let importedData
    let errors
    try {

        importedData = await axios.get(urls);//.then(rsp => importedData = rsp)

    } catch (err) {
        err => errors = err
        //        res.send(err)
    }

    //    console.log(importedData)//.data)


    if (_.isEmpty(importedData.data)) {
        res.send({})
    } else {

        let header = _.omit(importedData.data, 'detailTransaksi')

        const detail = _.map(_.pick(importedData.data, 'detailTransaksi').detailTransaksi, o => _.extend({ nomorFaktur: header.nomorFaktur }, o))


        const binds = { ...header, loginid: req.user.loginid }


        const bindsDetail = detail


        let ret = ''
        _.mapKeys(header, (v, x) => {

            if (x === 'detailTransaksi')
                return;

            ret = `${ret},:${x}`
        })

        let retD = ''
        _.mapKeys(detail[0], (v, x) => {

            if (x === 'detailTransaksi')
                return;

            retD = `${retD},:${x}`
        })



        let stmt = `insert into efaktur_header(KDJENISTRANSAKSI, FGPENGGANTI, NOMORFAKTUR, TANGGALFAKTUR,  NPWPPENJUAL, NAMAPENJUAL, ALAMATPENJUAL, NPWPLAWANTRANSAKSI,
            NAMALAWANTRANSAKSI, ALAMATLAWANTRANSAKSI, JUMLAHDPP, JUMLAHPPN, JUMLAHPPNBM, STATUSAPPROVAL, STATUSFAKTUR, REFERENSI, INPUTBY) 
       values (${ret.substring(1)},:loginid)`


        let stmtDetail = `insert into efaktur_detail(NOMORFAKTUR, NAMA, HARGASATUAN, JUMLAHBARANG, HARGATOTAL, DISKON, DPP, PPN, TARIFPPNBM, PPNBM)
        values     (${retD.substring(1)})`

        console.log(bindsDetail)

        try {
            result = await dbhandler.ManualInsert(users, stmt, binds, stmtDetail, bindsDetail)

            res.send(result)

        } catch (error) {
            res.send({ ...error, errorMessage: error.message })
        }

    }



}

module.exports.exportFaktur = exportFaktur;

async function getDetail(req, res, next) {



    await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, async (error, result) => {


        if (error) {
            return next(error)
        }

        const re_result = await UpdateResultAsync(result)


        res.send(
            // 
            re_result
            // count: (!_.isEmpty(result) ? result['data'][0]['total_rows'] : 0)
        )

    })


}
module.exports.getDetail = getDetail;


async function getViewData(req, res, next) {

    // console.log(req.params.prcode)
    //   console.log(req.query.search)
    // res.status(200).send('ok')

    await HandlerDB.fetchDataView(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        if (_.isEmpty(result))
            return res.status(200).send('kosong')

        const re_result = UpdateResult(result)


        res.send(
            re_result
        )

    })

}

module.exports.getViewData = getViewData;