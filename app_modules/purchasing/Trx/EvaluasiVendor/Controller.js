const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const { UpdateResult, insertdataHandler, updatedataHandler, deleteDataHandler } = require('../../../../util/HelperUtility')
const { executeStmt } = require('../../../../oradb/dbHandler')

const table = 'epms_web.vendor'

const table_vendor = 'epms_web.vendor'
const table_vendor_legal_detail = 'epms_web.vendor_legal_detail'


async function get(req, res, next) {

    await HandlerDB.fetchData(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {

        //  console.log('RESULT', result)
        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)
        res.send({
            ...result,
            data: re_result,
            count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
        })


    })

}

module.exports.get = get;

async function post(req, res, next) {

    await insertdataHandler(table, req, res)


}

module.exports.post = post;

async function update(req, res, next) {

    let _table, _tableCheck, _rowid, _statement, _approvedStatement,
        result, _keycode, _keycodeCheck, _approveCheck, approved, _vcode, _verified, _notes, _colNotes,
        _followupStatement


    if (req.user.department === 'LEGAL') {
        _table = 'epms_web.vendor_legal_detail'
        _tableCheck = 'epms_web.vendor'
        _keycode = 'vendorcode'
        _keycodeCheck = 'suppliercode'
        _rowid = req.body.legalrowid
        _vcode = req.body.vendorcode
        _verified = 'APPROVED'
        _colNotes = 'catatan_legal'

        _followupStatement = `begin EPMS_USTP.AUTO_EMAIL_iproc_legal('${_vcode}'); end;`

    } else if (req.user.department === 'PROCUREMENT' || req.user.loginid === 'GCM ADMIN') {
        _table = 'epms_web.vendor'
        _tableCheck = 'epms_web.vendor_legal_detail'
        _keycode = 'suppliercode'
        _keycodeCheck = 'vendorcode'
        _rowid = req.body.rowid
        _vcode = req.body.suppliercode
        _verified = 'APPROVED'
        _colNotes = 'catatan_proc'

        _followupStatement = `begin EPMS_USTP.AUTO_EMAIL_iproc_one('${_vcode}'); end;`

    }


    if (req.query.action === 'REJECTED') {
        _verified = req.query.action
        _notes = req.query.notes
    }

    if (_.isEmpty(_table)) {
        res.send({ status: 'User Unauthorized' })
    }
    else {

        if (req.query.action === 'REJECTED') {

            _statement = `update ${_table} set process_flag='${_verified}' ,
              validationdate = sysdate ,
               updateby = '${req.user.loginid}' ,
                validateby = '${req.user.loginid}',
                ${_colNotes} = '${_notes}'  
                where rowid = '${_rowid}' `

            //_approvedStatement = ` BEGIN update_vendor_p('${_vcode}');  END;`

            try {
                //  _approveCheck = await executeStmt(req.user, _check, [])

                result = await executeStmt(req.user, _statement, [])

                approved = await executeStmt(req.user, _followupStatement, [])



            } catch (error) {
                result = ({ ...error, errorMessage: error.message })
            }

            res.send({ status: 'success', ...result, ...approved })

        }
        else {
            _check = `SELECT C.process_flag
        FROM ${_table} s, ${_tableCheck} c
       WHERE     s.ROWID = '${_rowid}'
             AND s.${_keycode} = c.${_keycodeCheck}
             AND c.process_flag = 'APPROVED'`

            _statement = `update ${_table} set process_flag='APPROVED' ,  validationdate = sysdate , updateby = '${req.user.loginid}' , validateby = '${req.user.loginid}'  where rowid = '${_rowid}' `

            _approvedStatement = ` BEGIN update_vendor_p('${_vcode}');  END;`

            try {
                _approveCheck = await executeStmt(req.user, _check, [])

                result = await executeStmt(req.user, _statement, [])


                if (!_.isEmpty(_approveCheck)) {
                    approved = await executeStmt(req.user, _approvedStatement, [])
                }

            } catch (error) {
                result = ({ ...error, errorMessage: error.message })
            }

            res.send({ status: 'success', ...result, ...approved })

        }

    }
}

module.exports.update = update;

async function hapus(req, res, next) {
    await deleteDataHandler(table, req, res);
}

module.exports.hapus = hapus;



async function sendEmail(req, res, next) {

    let result;

    const users = { ...req.user }

    const binds = {
        vendorcode:req.query.vendorcode
    }
    // console.log(req)

    const stmt = `begin 
    epms_ustp.AUTO_EMAIL_iproc(:vendorcode);
end; `

// const stmt = ``

    try {
        result = await executeStmt(users,stmt, binds)
    } catch (error) {
        res.send({ ...error, errorMessage: error.message })
    }

    res.status(200).json(result)

}

module.exports.sendEmail = sendEmail