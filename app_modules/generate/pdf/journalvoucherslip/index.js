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
const { format } = require('date-fns');
const { el } = require('date-fns/locale');

async function test(req, res, next) {
    let responseResult, header, detail

    //get data from apps_component 
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
    res.send(responseResult)

}

module.exports.test = test;


async function get(req, res, next) {


    let responseResult, header, detail



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

    ///////////// FORMAT PRINT PDF /////////////
    let pdfFilename = `output/${req.query.reportname}.pdf`

    res.setHeader('Content-disposition', `attachment; filename=${pdfFilename}`);
    res.setHeader('Content-type', 'application/pdf');


    const doc = new jsPDF({ orientation: "landscape", compress: true, unit: 'mm', paper: 'a4' });


    doc.setFontSize(8);
    doc.setFont("times", "bold");
    // console.log("Page height", doc.internal.pageSize.height) // 210.0015555555555
    // console.log("Page width", doc.internal.pageSize.width) // 297.0000833333333


    await printTable(doc, responseResult)



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


///////////// FUNCTION HEAD ROWS /////////////
function headRows() {
    return [
        {
            id: { content: 'Location', colSpan: 2, styles: { halign: 'center' } },
            locationtypecode: { content: 'Activity', colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            remarks: { content: 'Description', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            faktur_pajak: { content: 'Inv Vendor / \nFaktur Pajak', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            debit: { content: 'Debit', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            credit: { content: 'Credit', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            volume: { content: 'Volume(Liter)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
        },
        [
            { content: 'Type', styles: { halign: 'center' } },
            { content: 'Code', styles: { halign: 'center' } },
            { content: 'Type', styles: { halign: 'center' } },
            { content: 'Name', styles: { halign: 'center' } }
        ]
    ]
}


///////////// FUNCTION BODY ROWS /////////////
function bodyRows(datas) {
    rowCount = _.size(datas) || 10
    var body = []
    _.map(datas, (v) => {
        // console.log('datas ->>>>>>>>>', datas)
        body.push([v.locationtype, v.locationtypecode, v.jobcode, v.jobdescription, v.remarks, v.faktur_pajak, v.debit, v.credit, v.volume])
    })


    return body
}

///////////// FUNCTION FOOTER ROWS /////////////
function footerRows(datas) {
    console.log("footer", datas)
    return [
        {
            id: { content: 'TOTAL:', colSpan: 6, styles: { halign: 'center' } },
            debit: { content: datas.sum_debit },
            credit: { content: datas.sum_credit },
            volume: { content: `${_.isUndefined(datas.sum_volume)}` ? "0" : datas.sum_volume }
        }
    ]
}

///////////// FUNCTION PRINT TABLE /////////////
function printTable(doc, data) {
    let index = 43

    ///////////// STYLING TABLE /////////////
    doc.autoTableSetDefaults({
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2 },
        bodyStyles: {
            fillColor: [255, 255, 255],
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0]
        },
        footStyles: {
            lineWidth: 0.2,
            fillColor: [200, 200, 200],
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0]
        }
    })




    let finalY = doc.lastAutoTable.finalY || index - 1

    // console.log('cek finalY :', doc.lastAutoTable.finalY || index);


    ///////////// PRINT TABLE   /////////////
    doc.autoTable({
        
        head: headRows(),
        body: bodyRows(data.datadetail),
        foot: footerRows(data),
        startY: finalY,
        theme: "grid",
        columnStyles: {
            4: { cellWidth: 55 }
        },
        showFoot: "lastPage",
        showHead: "everyPage",

        didParseCell: function(data) {
            const test = data.section
            // console.log(test);
            if(data.section == 'body' && data.column.index === 6){
                data.cell.styles.halign = 'right'
            }
            if(data.section == 'body' && data.cell.index === 7){
                data.cell.styles.halign = 'right'
            }
            else if(data.section == 'body' && data.cell.index === 8){
                data.cell.styles.halign = 'right'
            }
            else if(data.section == 'foot'){
                data.cell.styles.halign = 'right'
            }
            data.cell.styles.fontSize = 8;
    
          },

        margin: { top: 42, right: 5, left: 5 },
    });

    

    // console.log(' tergambar  :', doc.lastAutoTable.finalY)

    const lastY = doc.lastAutoTable.finalY
    

    ///////////// PRINT KOLOM TANDA TANGAN /////////////
    doc.autoTable({

        startY: doc.lastAutoTable.finalY + 20,
        columns: [
            { header: 'Prepared By', dataKey: 'Prepared By' },
            { header: 'Reviewed By', dataKey: 'Reviewed By' },
            { header: 'Approved By', dataKey: 'Approved By' },
        ],
        body: [
            { disetujui: '', diperiksa: '', diterima: '' }, // Ini adalah baris kosong untuk tanda tangan
        ],
        foot: [
            { disetujui: '', diperiksa: '', diterima: '' },
        ],

        ///////////// STYLING KOLOM TANDA TANGAN /////////////
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: 'center', fontSize: 8},
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, cellPadding: Padding = 10 },
        footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: 'center' },
        startY: lastY >= 141 ? lastY + 40 : lastY + 10,
        theme: 'grid',
        margin: { top: finalY + 15, right: doc.internal.pageSize.width / 5, left: doc.internal.pageSize.width / 5 },
        columnStyles: {
            disetujui: { cellWidth: doc.internal.pageSize.width / 5 }, // Atur lebar kolom Disetujui
            diperiksa: { cellWidth: doc.internal.pageSize.width / 5 }, // Atur lebar kolom Diperiksa
            diterima: { cellWidth: doc.internal.pageSize.width / 5 }, // Atur lebar kolom Diterima
        },
    });


    ///////////// LOOPING KOP /////////////
    var pageCount = doc.internal.getNumberOfPages(); //Total Page Number
    for (i = 0; i < pageCount; i++) {
        doc.setPage(i);
        let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber; //Current Page
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");

        doc.text("Page", 247, 18);
        doc.text(':',  260.6, 18);
        doc.text(pageCurrent + "  of  " + pageCount, 262.6, 18);
   

        const titleSize = 16
        const subtitleSize = 10
        const remarksDocumentSize = 7
        const headerSize = 8
        const font = "helvetica"

        const marginHeaderLeft = doc.internal.pageSize.width - 290
        const marginKiriRemarkDoc = doc.internal.pageSize.width - 50;

        {/* Title */ }
        doc.setFont(font, "bold");
        doc.setFontSize(titleSize);
        doc.text("JOURNAL REPORT", marginHeaderLeft, 12, { charSpace: 2 });

        {/* SubTitle */ }
        doc.setFont(font, "bold");
        doc.setFontSize(subtitleSize);
        doc.text("PT GRAHA CAKRA MULIA", marginHeaderLeft, 18, null, null);

        {/* remarks Document  */ }
        const remarksDocument = [
            { label: "Print By", value: "" },
            { label: "Print Date", value: `${format(new Date(), 'dd-MM-yyyy hh:mm')}`, },
            { label: "File Name", value: "Receive Note" },
        ]

        let maxLabelWidthRemarksDoc = 0;

        remarksDocument.forEach(({ label }) => {
            const labelWidth = doc.getStringUnitWidth(label) * remarksDocumentSize / doc.internal.scaleFactor;
            if (labelWidth > maxLabelWidthRemarksDoc) {
                maxLabelWidthRemarksDoc = labelWidth;
            }
        });

        let currentRemarkY = 6;
        const remarkX = marginKiriRemarkDoc;
        const colonRemark = remarkX + maxLabelWidthRemarksDoc + 2;
        const dataRemark = colonRemark + 2;

        remarksDocument.forEach(({ label, value }) => {
            doc.setFontSize(remarksDocumentSize);
            doc.setFont(font, "normal")
            doc.text(label, remarkX, currentRemarkY);
            doc.text(':', colonRemark, currentRemarkY);
            doc.text(value, dataRemark, currentRemarkY);
            currentRemarkY += 4;
        });

        ///////////// LABEL LEFT /////////////
        doc.setFontSize(headerSize);
        doc.setFont(font, "bold");
        // label - begin
        let maxLabelWidthLeft = 0;

        {/* Value And Label Left Segment*/ }
        const labelValueLeftColumn = [
            { label: "Batch No", value: `${data.batchno} `, },
            { label: "Description", value: `${data.description}` },
            { label: "JV No", value: `${data.jvno}` },
        ];
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1);
        doc.line(5, 39, doc.internal.pageSize.width - 5, 39);


        labelValueLeftColumn.forEach(({ label }) => {
            const labelWidth = doc.getStringUnitWidth(label) * headerSize / doc.internal.scaleFactor;
            if (labelWidth > maxLabelWidthLeft) {
                maxLabelWidthLeft = labelWidth;
            }
        });

        const marginKanan = doc.internal.pageSize.width - 290;
        {/* Set Coordinates Var for Left Segment*/ }


        let currentleftY = 24;
        const leftlabelX = marginKanan;
        const colonLeft = leftlabelX + maxLabelWidthLeft + 2;
        const dataLeft = colonLeft + 3;

        // console.log('marginKanan :', marginKanan);
        // console.log('maxLabelWidthLeft :', maxLabelWidthLeft);
        // console.log('leftlabelX :', leftlabelX);



        labelValueLeftColumn.forEach(({ label, value }) => {
            doc.setFont("helvetica", "bold");
            doc.text(label, leftlabelX, currentleftY);
            doc.setFont("helvetica", "bold");
            doc.text(':', colonLeft, currentleftY);
            doc.setFont("helvetica", "normal");
            doc.text(value, dataLeft, currentleftY, { maxWidth: doc.internal.pageSize.width / 1.6 });   ///2.6
            currentleftY += 6;
        });

        // label  - end


        ///////////// LABEL MIDDLE LEFT /////////////
        // label  MiddleLeft - begin
        let maxLabelWidthMiddleLeft = 0;

        // console.log('cek max widh kedua :',maxLabelWidthMiddleLeft)
        {/* Value And Label Left Segment*/ }
        const labelValueColumnMiddleLeft = [
            { label: "Periode", value: `${data.periodno}  `, },
            { label: "Total Amount", value: `${data.totalamount}` },
        ];

        labelValueColumnMiddleLeft.forEach(({ label }) => {
            const labelWidthMiddleLeft = doc.getStringUnitWidth(label) * headerSize / doc.internal.scaleFactor;
            if (labelWidthMiddleLeft > maxLabelWidthMiddleLeft) {
                maxLabelWidthMiddleLeft = labelWidthMiddleLeft;
            }
        });

        {/* Set Coordinates Var for Left Segment*/ }
        let currentleftYMiddleLeft = 24;
        const leftlabelXMiddleLeft = marginKanan + maxLabelWidthMiddleLeft + 60

        const labelMiddleLeft = leftlabelXMiddleLeft;
        const colonMiddleLeft = leftlabelXMiddleLeft + 25;
        const dataMiddleLeft = colonMiddleLeft + 3;


        labelValueColumnMiddleLeft.forEach(({ label, value }) => {
            doc.setFont("helvetica", "bold");
            doc.text(label, labelMiddleLeft, currentleftYMiddleLeft);
            doc.setFont("helvetica", "bold");
            doc.text(':', colonMiddleLeft, currentleftYMiddleLeft);
            doc.setFont("helvetica", "normal");
            doc.text(value, dataMiddleLeft, currentleftYMiddleLeft, { maxWidth: doc.internal.pageSize.width / 1.6 });   ///2.6
            currentleftYMiddleLeft += 12;
        });

        // label  MiddleLeft - end


        ///////////// LABEL MIDDLE RIGHT /////////////
        // label  MiddleRight - begin
        let maxLabelWidthMiddleRight = 0;

        // console.log('cek max widh kedua :',maxLabelWidthMiddleRight)
        {/* Value And Label Left Segment*/ }
        const labelValueColumnMiddleRight = [
            { label: "Total Amount", value: `${data.totalamount} `, },
            { label: "Currency", value: `${data.currency}` },
        ];

        labelValueColumnMiddleRight.forEach(({ label }) => {
            const labelWidthMiddleRight = doc.getStringUnitWidth(label) * headerSize / doc.internal.scaleFactor;
            if (labelWidthMiddleRight > maxLabelWidthMiddleRight) {
                maxLabelWidthMiddleRight = labelWidthMiddleRight;
            }
        });

        {/* Set Coordinates Var for Left Segment*/ }
        let currentleftYMiddleRight = 24;
        const leftlabelXMiddleRight = marginKanan + maxLabelWidthMiddleRight + 130
        //  const leftlabelXMiddleRight = 7 + 20 + 60 = 87

        const labelMiddleRight = leftlabelXMiddleRight;
        const colonMiddleRight = leftlabelXMiddleRight + 25;
        const dataMiddleRight = colonMiddleRight + 3;



        labelValueColumnMiddleRight.forEach(({ label, value }) => {
            doc.setFont("helvetica", "bold");
            doc.text(label, labelMiddleRight, currentleftYMiddleRight);
            doc.setFont("helvetica", "bold");
            doc.text(':', colonMiddleRight, currentleftYMiddleRight);
            doc.setFont("helvetica", "normal");
            doc.text(value, dataMiddleRight, currentleftYMiddleRight, { maxWidth: doc.internal.pageSize.width / 1.6 });   ///2.6
            currentleftYMiddleRight += 12;
        });

        // label  MiddleRight - end


        ///////////// LABEL MIDDLE RIGHT /////////////
        // label  Right - begin
        let maxLabelWidthRight = 0;

        // console.log('cek max widh kedua :',maxLabelWidthRight)
        {/* Value And Label Left Segment*/ }
        const labelValueColumnRight = [
            { label: "No. of Voucher ", value: `${data.numberjournal} `, },
            { label: "Date ", value: `${format(data.transactiondate, 'dd-MM-yyyy')}` },
        ];

        labelValueColumnRight.forEach(({ label }) => {
            const labelWidthRight = doc.getStringUnitWidth(label) * headerSize / doc.internal.scaleFactor;
            if (labelWidthRight > maxLabelWidthRight) {
                maxLabelWidthRight = labelWidthRight;
            }
        });

        {/* Set Coordinates Var for Left Segment*/ }
        let currentleftYRight = 24;
        const leftlabelXRight = marginKanan + maxLabelWidthRight + 200
        //  const leftlabelXRight = 7 + 20 + 60 = 87

        const labelRight = leftlabelXRight;
        const colonRight = leftlabelXRight + 27;
        const dataRight = labelRight + 30;


        labelValueColumnRight.forEach(({ label, value }) => {
            doc.setFont("helvetica", "bold");
            doc.text(label, labelRight, currentleftYRight);
            doc.setFont("helvetica", "bold");
            doc.text(':', colonRight, currentleftYRight);
            doc.setFont("helvetica", "normal");
            doc.text(value, dataRight, currentleftYRight, { maxWidth: doc.internal.pageSize.width / 1.6 });   ///2.6
            currentleftYRight += 12;
        });

        // label  Right - end

    }
}

module.exports.get = get;

