const _ = require('lodash')
const fs = require('fs');

const xlsx = require('xlsx')
const path = require('path')

const dbhandler = require('../oradb/dbHandler')

const CryptoJS = require('crypto-js')
const { DOCTYPE } = require('./Constants')

const OKEY = 'k3l4p45@w!t'



function UpdateResult(result) {
    if (_.isEmpty(result))
        return []

    return _.map(result.data, (v) => {

        return _.mapKeys(
            _.mapValues(v, (a, b) => {



                if (b.match('#code')) {

                    const keys = _.find(result.component, ['formcomponent', b.replace('#code', '')])


                    try {
                        //const { lov_list_item: key_code } = keys;

                        const key_code = keys?.lov_list_item

                        const vcode = _.isEmpty(key_code) ? ['code', 'description'] : key_code.split(';')

                        let returnObject = {}

                        _.map(vcode, (vkey, idx) => {

                            const objVal = (idx > 0 ? v[b.replace('#code', `#${vkey}`)] : v[b])
                            _.assignIn(returnObject, { [vkey]: objVal })
                        })

                        return returnObject
                    } catch (error) {
                        return {}
                    }
                }
                return a;
            }), (a, c) => {
                return (c.replace('#code', ''))
            })

    })
}

async function UpdateResultAsync(result) {

    return _.map(result.data, (v) => {

        return _.mapKeys(
            _.mapValues(v, (a, b) => {

                if (b.match('#code')) {

                    const keys = _.find(result.component, ['formcomponent', b.replace('#code', '')])

                    //                    const { lov_list_item: key_code } = keys;
                    try {
                        const key_code = keys?.lov_list_item


                        const vcode = _.isEmpty(key_code) ? ['code', 'description'] : key_code.split(';')

                        let returnObject = {}

                        _.map(vcode, (vkey, idx) => {
                            const objVal = (idx > 0 ? v[b.replace('#code', `#${vkey}`)] : v[b])
                            _.assignIn(returnObject, { [vkey]: objVal })
                        })


                        return returnObject
                    } catch (error) {
                        return {}

                    }
                }
                return a;
            }), (a, c) => {
                return (c.replace('#code', ''))
            })

    })
}


async function UpdateDetail(result) {

    const keys = _.find(result.component, ['is_child_key', 'true'])



    let _obj = _.uniqBy(_.map(result.data, function (x) { return _.pickBy(x, function (value, key) { return !_.startsWith(key, "sub#") }) }), 'tid')

    let _subdata = _.map(_.flatMap(result.data, function (x) { return _.pickBy(x, function (value, key) { return _.startsWith(key, "sub#") }) })
        , arr => _.mapKeys(arr, (value, key) => key.replace('sub#', '')))


    _.map(_obj, function (x, y) {

        const inputgriddetail = _.filter(_subdata, function (value) {
            return x[keys.formcomponent] === value[keys.formcomponent]
        })

        if (!_.isEmpty(inputgriddetail)) {
            _.assign(x, { inputgriddetail: inputgriddetail })
        }

    })

    return _.map(_obj, (v) => {
        return _.mapKeys(
            _.mapValues(v, (a, b) => {

                if (b.match('#code')) {

                    const keys = _.find(result.component, ['formcomponent', b.replace('#code', '')])
                    try {
                        const { lov_list_item: key_code } = keys;
                        const vcode = _.isEmpty(key_code) ? ['code', 'description'] : key_code.split(';')

                        let returnObject = {}

                        _.map(vcode, (vkey, idx) => {
                            const objVal = (idx > 0 ? v[b.replace('#code', `#${vkey}`)] : v[b])

                            _.assignIn(returnObject, { [vkey]: objVal })
                        })

                        return returnObject
                    } catch (error) {
                        return {}
                    }
                }
                return a;
            }), (a, c) => {
                return (c.replace('#code', ''))
            })

    })

}

async function insertdataHandler(table, req, res) {
    const stmt = req
    const binds = req

    let resultResponse


    try {
        await dbhandler
            .insertdataCustom(table, req.user, req.body, binds)
            .then(result => resultResponse = result)
            .catch(error => resultResponse = { 'error': error.message, 'detail': error.stack });

    } catch (error) {
        resultResponse = error
    }



    res.status(200).json(resultResponse)
}

async function insertdataHandlerNew(table, req, res) {
    const stmt = req
    const binds = req

    let resultResponse

    try {
        await dbhandler
            .insertdata(table, req.user, req.body, binds)
            .then(result => resultResponse = result)
            .catch(error => resultResponse = { 'error': error.message, 'detail': error.stack });

    } catch (error) {
        resultResponse = error
    }



    res.status(200).json(resultResponse)
}

async function updatedataHandler(table, req, res) {
    const binds = req

    let resultResponse

    try {
        await dbhandler
            .updateData(table, req.user, req.body, binds)
            .then(result => resultResponse = result)
            .catch(error => resultResponse = { 'error': error.message, 'detail': error.stack });

    } catch (error) {
        resultResponse = error
    }

    res.status(200).json(resultResponse)

}


async function deleteDataHandler(table, req, res) {
    let resultResponse, errorResponse, dataid = req.query.id

    try {

        await dbhandler
            .deleteData(table, req.user, dataid).then(result => {
                if (result.error) {
                    errorResponse = result
                } else {
                    resultResponse = result
                }
            }).catch(error => {
                errorResponse = { error: error.message, detail: error.stack }
            });

    } catch (error) {
        errorResponse = error
    }

    if (errorResponse) {
        res.status(200).json(errorResponse)
    } else {
        res.status(200).json(resultResponse)
    }


}


async function sendResult(result, res) {

    // console.log('send result', result)

    let re_result, errors

    if (_.isEmpty(result))
        res.send()


    try {
        re_result = UpdateResult(result)

    } catch (error) {
        errors = error

    }

    //   console.log('send result ', errors.stack)

    res.send({
        ...result,
        data: re_result,
        count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
    })
}

async function Decryptor(v) {

    /* const key = 'asdasdasdasd' //crypto.randomBytes(32);
  const iv = '10298390123i09asudkljas'//crypto.randomBytess(16);

  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(v);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
*/

    // Encrypt
    //  var ciphertext = CryptoJS.AES.encrypt(v, OKEY).toString();

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(v, OKEY);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);

    // console.log(ciphertext); // 'my message'
    // console.log(originalText); // 'my message'

    return originalText
}


async function parseStringToDate(str, separator) {
    if (!str) return

    //  // // console.log(str)

    const [day, month, year] = str.split(separator)
    let dates = new Date(Number(year), Number(month) - 1, Number(day))

    return dates
};

async function setReportName(req, res, docname, doctype) {

    let contenttype, filetype

    switch (doctype) {
        case DOCTYPE.PDF:
            contenttype = 'application/pdf'
            filetype = 'pdf'
            break;
        case DOCTYPE.XLS:
            contenttype = 'application/vnd.ms-excel'
            filetype = 'xlsx'
            break;
        default:
            break;
    }

    let dir = `./output/${req.headers.authorization.replaceAll('.', '0').substring(0, 250)}`
    let fileName = `${docname}.${filetype}`


    if (!fs.existsSync(dir)) {    //check if folder already exists
        fs.mkdirSync(dir, { recursive: true }, err => console.log('error mkdir', err));    //creating folder
    }


    const reportName = `${dir}/${fileName}`

    console.log(reportName)

    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', contenttype);

    return reportName
}




const exportToExcel = async (data, sheetname, filepath) => {

    headers = _.keys(data[0])

    headers_1 = _.keys(data[0])

    const workbook = xlsx.utils.book_new()

    const mapData = _.map(data, (v) => { return _.map(headers, (x) => { /* console.log(v[x]); */ return v[x] }) })

    const worksheetdata = [headers, ...mapData]

    const worksheet = xlsx.utils.aoa_to_sheet(worksheetdata)

    xlsx.utils.book_append_sheet(workbook, worksheet, sheetname)


    xlsx.writeFile(workbook, path.resolve(filepath))

    return workbook
}

const exportToExcelManySheets = async (_obj, filepath) => {

    const workbook = xlsx.utils.book_new()

    _.map(_obj, ({ data, sheetname }) => {

        let headers = _.keys(data[0])

        const mapData = _.map(data, (v) => _.map(headers, (x) => v[x]))

        const worksheetdata = [headers, ...mapData]

        const worksheet = xlsx.utils.aoa_to_sheet(worksheetdata)

        xlsx.utils.book_append_sheet(workbook, worksheet, sheetname)

    })

    xlsx.writeFile(workbook, path.resolve(filepath))

    return workbook
}

const generateExcel = async (data, sheetname, filepath) => {

    ///console.log('data excel', filepath)

    const xtc = await exportToExcel(data, sheetname, filepath)

    const buf = await xlsx.write(xtc, { type: "buffer", bookType: "xlsx", compression: true });

    return buf
}

const generateDynamicSheetXLS = async (_obj, filepath) => {

    const xtc = await exportToExcelManySheets(_obj, filepath)

    const buf = await xlsx.write(xtc, { type: "buffer", bookType: "xlsx", compression: true });

    return buf
}


const authorizedRoute = async function (req, res, next) {
    // todo : run logic here

    // console.log('authorizedRoute')

    //res.status(200).send('unauthoried route ')

    next()

}

module.exports = {
    UpdateResult,
    UpdateDetail,
    insertdataHandler,
    updatedataHandler,
    deleteDataHandler,
    sendResult,
    Decryptor,
    UpdateResultAsync,
    parseStringToDate,
    setReportName,
    generateExcel,
    generateDynamicSheetXLS,
    authorizedRoute
}