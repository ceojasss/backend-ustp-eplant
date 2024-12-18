/*=============================================================================
 |       Author:  Gunadi Rismananda
 |         Dept:  IT - USTP
 |          
 |  Description:  Handling API ROUTE Untuk List Value Data.
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/

const _ = require('lodash')
const fs = require('fs')
const { jsPDF } = require("jspdf"); // will automatically load the node version
require('jspdf-autotable');



const db = require('./db');
const { setReportName, initBuildReport, ConstantsObject, ReportHeader, DocumentProperties, Constants } = require('../reporthelper');
const { mt } = require('date-fns/locale');


async function get(req, res, next) {


    let responseResult, header, detail, title, subtitle


    //console.log(req.headers.authorization.replaceAll('.', '0').substring(0,255))


    //DATA

    //    await d

    //await db.fetFfetchFromTempData = async (users, fillTempStatement, statement, bindsFill = [], BindsSt = []) 
    await db.fetchDataDynamic(req.user, '',
        (error, result) => {
            if (!_.isEmpty(error)) {
                responseResult = error;
            }
            else {

                header = _.map(result.rows, (c) => _.pickBy(c, (value, key) => key.indexOf('DETAIL#') === -1))[0]
                details = _.map(_.map(result.rows, (c) => _.pickBy(c, (value, key) => key.indexOf('DETAIL#') > -1)), c => _.mapKeys(c, (x, y) => y.replace('DETAIL#', '')))

                _.assignIn(header, { datadetail: details })

                responseResult = header

            }
        })

    // Inisialisasi Report 
    // 1. set File 
    // 2. set document builder

    //    console.log(ConstantsObject.PORTRAIT_A4)

    const pdfFilename = await setReportName(req, res)
    const doc = await initBuildReport(ConstantsObject.PORTRAIT_A4)// new jsPDF(PORTRAIT_A4);
    const props = DocumentProperties.PORTRAIT_A4


    title = req.query.reportname
    subtitle = req.query.vouchercode

    //* PRINT DATA (execute first to get all pages generated)
    await printTable(doc, responseResult)

    console.log(responseResult.bankname)
    //var pageCount = doc.internal.getNumberOfPages();

    for (i = 0; i < doc.internal.getNumberOfPages(); i++) {
        doc.setPage(i);

        //? WRITE HEADER DOCUMENT
        ReportHeader(doc, req, props, { title, subtitle })
        let mTop = 40

        let baris1 = mTop + 8
        let baris2 = mTop + 8
        let baris3 = mTop + 8

        //? WRITE HEADER DATA
        doc.setFont(Constants.DEFAULT_FONT, "bold");
        doc.setFontSize(Constants.HEADER_FONT_SIZE);
        doc.text(`Bukti Pengeluaran ${responseResult.bankname}`, props.ALignLeftPosition, mTop, null, null, Constants.LEFT);
        doc.line(props.ALignLeftPosition, mTop + 2, props.MaxWidth, mTop + 2); // horizontal line

        //header baris 1
        doc.text(`No. Rekening`, props.ALignLeftPosition, mTop + 8, null, null, Constants.LEFT);
        doc.text(`Mata uang`, props.ALignLeftPosition + 80, mTop + 8, null, null, Constants.LEFT);

        //header label baris 2
        doc.text(`Cheque/Giro No.`, props.ALignLeftPosition, mTop + 14, null, null, Constants.LEFT);
        doc.text(`Kurs`, props.ALignLeftPosition + 80, mTop + 14, null, null, Constants.LEFT);
        doc.text(`Tanggal`, props.ALignLeftPosition + 140, mTop + 14, null, null, Constants.LEFT);

        //header value baris 1
        doc.setFont(Constants.DEFAULT_FONT, "normal");
        doc.text(`${responseResult.bankcode} ${responseResult.bankname}`, props.ALignLeftPosition + 30, mTop + 8, null, null, Constants.LEFT);
        doc.text(`${responseResult.currency}`, props.ALignLeftPosition + 105, mTop + 8, null, null, Constants.LEFT);
        //doc.line(props.ALignLeftPosition, 46, props.MaxWidth, 46); // horizontal line

        //header value baris 2
        doc.text(`${responseResult.bankcode} ${responseResult.bankname}`, props.ALignLeftPosition + 30, mTop + 8, null, null, Constants.LEFT);
        doc.text(`${responseResult.currency}`, props.ALignLeftPosition + 105, mTop + 8, null, null, Constants.LEFT);
        doc.text(`${responseResult.currency}`, props.ALignLeftPosition + 105, mTop + 8, null, null, Constants.LEFT);


        doc.setFontSize(Constants.DOC_INFO_FONT_SIZE);
        doc.setFont(Constants.DEFAULT_FONT, "bold");
        doc.text(`No`, props.AlignRightPosition, 18.5, null, null, Constants.LEFT);
        doc.setFont(Constants.DEFAULT_FONT, "normal");
        doc.text(subtitle, props.AlignEndPosition, 18.5, null, null, Constants.RIGHT);


        /*         doc.setFontSize(Constants.SUBTITLE_FONT_SIZE);
                doc.text(`Bukti Pengeluaran `, props.ALignLeftPosition, 38, null, null, Constants.LEFT);
         */


    }


    doc.save(pdfFilename)

    res.sendFile(pdfFilename, { root: '.' }, (err) => {
        if (err) {
            console.log('Error sending PDF:', err);
            res.status(500).send('Error generating PDF');
        } else {
            console.log('PDF sent successfully');
        }
    });
}



function headRows() {
    return [
        {
            id: { content: 'Lokasi', colSpan: 2, styles: { halign: 'center' } },
            account: { content: 'Account', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            reference: { content: 'Account Desc', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            cfcode: { content: 'Kode CF', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            remarks: { content: 'Uraian', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            amount: { content: 'Jumlah', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
        },
        [
            { content: 'Tipe', styles: { halign: 'center' } },
            { content: 'Kode', styles: { halign: 'center' } }
        ]

        /*        ['Tipe', 'Kode', 'Account', 'Account Description', 'Kode C/F', 'Uraian', 'Jumlah']
             */       /*             { content: 'Type', styles: { halign: 'center' } },
{ content: 'Types', styles: { halign: 'center' } },
{ content: 'Typed', styles: { halign: 'center' } },
{ content: 'Typef', styles: { halign: 'center' } },
{ content: 'Typeg', styles: { halign: 'center' } },
{ content: 'Typeg', styles: { halign: 'center' } },
{ content: 'Typea', styles: { halign: 'center' } },
},
*/        //{ locationtype: { content: 'type' } },
        //        { locationtype: 'tipe', locationcode: 'kode', account: 'Account', reference: 'Account Description', cfcode: 'Kode C/F', remarks: 'Uraian', amount: 'jumlah' }
    ]
}

function bodyRows(datas) {
    rowCount = _.size(datas) || 10
    var body = []
    _.map(datas, (v) => {
        body.push([v.locationtype, v.locationcode, v.account, v.reference, v.cfcode, v.remarks, v.amount])
    })
/*     for (var j = 1; j <= rowCount; j++) {
        body.push({
            locationtype: 'tipe', locationcode: 'kode', account: 'Account', reference: 'Account Description', cfcode: 'Kode C/F', remarks: 'Uraian', amount: 'jumlah'
        })
    }
 */    return body
}


function printTablex(doc, data) {
    let index = 50

    //baris 1
    doc.text(`Voucher Code : ${data.vouchercode}`, 10, 50);
    doc.text(`Currency Code : ${data.currency}`, 150, 50);

    //baris 2
    //    doc.text("This is right aligned text", 200, 70, null, null, "right");

    /// print headers dynamic
    /* _.map(data, (_value, _key) => {
        if (_key !== 'datadetail') {
            //doc.font('Helvetica-Bold').fontSize(16).text(`${_key}: ${_value}`, { align: 'left' });
            doc.text(`${_key}: ${_value}`, 20, 50 + index);

        }
        index += 10
    }) */


    doc.autoTableSetDefaults({
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        bodyStyles: {
            fillColor: [255, 255, 255]
        }
    })

    let finalY = doc.lastAutoTable.finalY || index + 20

    doc.autoTable({
        head: headRows(),
        body: bodyRows(data.datadetail),
        startY: finalY + 10,
        theme: 'grid',
        //showHead: 'firstPage',
    })



    /*     doc.autoTable({
            head: headRows(),
            body: data.datadetail,
            startY: finalY + 10,
            theme: 'grid',
            //showHead: 'firstPage',
        })
     */

}

// Function For Print The Table \\
function printTable(doc, data) {

    let index = 20;
    let finalY = doc.lastAutoTable.finalY || index + 20


    // Styling Table \\
    doc.autoTableSetDefaults({
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2 },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2 },
    })
    // Width Column Table \\
    var columnwidth = {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 75 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 0 },
    };


    console.log('data', data)

    doc.autoTable({
        head: headRows(),
        body: bodyRows(data?.datadetail),
        startY: finalY + 30,
        theme: 'grid',
        //showHead: 'firstPage',
    })




}

module.exports.get = get;