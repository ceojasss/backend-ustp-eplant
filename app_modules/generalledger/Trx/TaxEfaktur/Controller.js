const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const axios = require('axios')
const convert = require('xml-js');

const { sendResult, insertdataHandler, UpdateResult, updatedataHandler, deleteDataHandler, UpdateResultAsync } = require('../../../../util/HelperUtility')
const dbhandler = require('../../../../oradb/dbHandler')
const dbCrudHandler = require('../../../../oradb/dbCrudHandler')
const table = 'LEGAL_EXT_REPORT_DATA'
const oracledb = require('oracledb');

async function get(req, res, next) {


    await HandlerDB.fetchDataHeader(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {


        if (error) {
            return next(error)
        }
        // if(_.isUndefined(result['data'])||_.isEmpty(result['data'])){
        //     res.send({
        //         
        //         ...result,
        //         count: 0
        //     })
        // } else {
        //     // result['data'][0]['total_rows']
        //     res.send({
        //         
        //         ...result,
        //         count: result['data'][0]['total_rows']
        //     })
        // }
        const re_result = UpdateResult(result)
        res.send({
            ...result,
            data: re_result,
            count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
        })

        /* const re_result = UpdateResult(result)


        res.send({
            ...result,
            data: re_result,
            count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
        }) */



    })

}

module.exports.get = get;


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
        } catch (error) {
            res.send({ ...error, errorMessage: error.message })
        }


        //    console.log(stmt)



        res.send(result)



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

