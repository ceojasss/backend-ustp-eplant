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
 
 async function test(req, res, next){
     let responseResult, header, detail
 
     console.log(req.query)
 
 
     //DATA
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
 
     console.log(req.query)
 
 
     //DATA
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
     // console.log("res --------->", responseResult)
 
     // PRINT PDF
     let pdfFilename = `output/${req.query.reportname}.pdf`
 
     res.setHeader('Content-disposition', `attachment; filename=${pdfFilename}`);
     res.setHeader('Content-type', 'application/pdf');
 
 
     const doc = new jsPDF({ orientation: "landscape", });
 
     
 
     // HEADER DOCUMENT
     // let imgData = fs.readFileSync('./resources/ustp_small.png').toString('base64');
 
     // doc.addImage(imgData, "PNG", 15, 10, 20, 28);
 
     // doc.text("JOURNAL REPORT", 15, 10, null, null);
     // doc.text("PT. Graha Cakra Mulia", 15, 20, null, null);
 
     // doc.setFont("courier", "bold");
     // doc.setFontSize(8);
     // doc.text(`print date: ${format(new Date(), 'dd-MM-yyyy')}`, 200, 10, null, null, "right");
 
     doc.setFontSize(11);
     doc.setFont("times", "bold");
     // console.log("Page height", doc.internal.pageSize.height)
     // console.log("Page width", doc.internal.pageSize.width)
 
 
     await printTable(doc, responseResult)
     // await headMenus(doc, responseResult)
 
 
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
             id: { content: 'Location', colSpan: 2, styles: { halign: 'center' } },
             locationtypecode: { content: 'Activity', colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             remarks: { content: 'Description', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             faktur_pajak: { content: 'Inv Vendor/ Faktur Pajak', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
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
         // console.log('datas ->>>>>>>>>', datas)
         body.push([v.locationtype, v.locationtypecode, v.jobcode, v.jobdescription, v.remarks, v.faktur_pajak,  v.debit, v.credit, v.volume])
     })
 /*     for (var j = 1; j <= rowCount; j++) {
         body.push({
             locationtype: 'tipe', locationcode: 'kode', account: 'Account', reference: 'Account Description', cfcode: 'Kode C/F', remarks: 'Uraian', amount: 'jumlah'
         })
     }
  */    return body
 }
 
 function footerTable(datas){
     console.log("footer", datas)
     return [
         {
             id: { content: 'TOTAL', colSpan: 6, styles: { halign: 'center' } },
             debit: { content: datas.sum_debit},
             credit: { content: datas.sum_credit},
             volume: {content: `${_.isUndefined(datas.sum_volume)}` ? "0" : datas.sum_volume}
         }
     ]
 }
 
 
 function printTable(doc, data) {
     let index = 50
 
     //baris 1
     // doc.text(`Batch No. : ${data.batchno}`, 15, 50);
     // doc.text(`Periode : ${data.periodno}`, 75, 50);
     // doc.text(`Total Amount : ${data.totalamount}`, 100, 50);
     // doc.text(`No. of Voucher : ${data.numberjournal}`, 150, 50);
     // doc.text(`Description : ${data.description}`, 15, 60, {maxWidth: doc.internal.pageSize.width/3});
     // doc.text(`JV No. : ${data.jvno}`, 15, 70);
     // doc.text(`Total Amount : ${data.totalamount_1}`, 70, 70);
     // doc.text(`Currency : ${data.currency}`, 115, 70);
     // doc.text(`Date : ${format(data.transactiondate, 'dd-MM-yyyy')}`, 150, 70);
 
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
         headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], lineColor: [0,0,0], lineWidth: 0.2 },
         bodyStyles: {
             fillColor: [255, 255, 255],
             lineWidth: 0.2,
             lineColor: [0,0,0]
         },
         footStyles: {
             lineWidth: 0.2,
             fillColor: [200,200,200],
             lineColor: [0,0,0],
             textColor: [0,0,0]
         }
     })
 
     
 
     let finalY = doc.lastAutoTable.finalY || index + 20
 
     console.log('>>>>>>>>>>>>>>>>>>>>>>>>',doc.internal.pageSize.width)
 
     doc.autoTable({
       head: headRows(),
       body: bodyRows(data.datadetail),
       foot: footerTable(data),
       startY: finalY + 10,
       theme: "grid",
       showFoot: "lastPage",
       showHead: "everyPage",
       didParseCell: function(data) {
         if(data.column.index === 6){
             data.cell.styles.halign = 'right'
         // } && data.column.index === 7 && data.column.index === 8){
         }
         if(data.cell.index === 7){
             data.cell.styles.halign = 'right'
         }
         else if(data.cell.index === 8){
             data.cell.styles.halign = 'right'
         }
       },
       didDrawPage: function () {
         // console.log*("diddrawpage ------------->",data)
         doc.setFont("helvetica", "bold");
         doc.setFontSize(13);
         doc.text("JOURNAL REPORT", 15, 10, null, null);
         doc.text("PT. Graha Cakra Mulia", 15, 20, null, null);
         doc.setFont("courier", "bold");
         doc.setFontSize(8);
         doc.text(
           `print date: ${format(new Date(), "dd-MM-yyyy HH:MM")}`,
           200,
           10,
           null,
           null,
           "right"
         );
         doc.text(`Batch No. : ${data.batchno}`, 15, 50);
         doc.text(`Periode : ${data.periodno}`, 75, 50);
         doc.text(`Total Amount : ${data.totalamount}`, 100, 50);
         doc.text(`No. of Voucher : ${data.numberjournal}`, 150, 50);
         doc.text(`Description : ${data.description}`, 15, 60, {maxWidth: doc.internal.pageSize.width/3});
         doc.text(`JV No. : ${data.jvno}`, 15, 70);
         doc.text(`Total Amount : ${data.totalamount_1}`, 70, 70);
         doc.text(`Currency : ${data.currency}`, 115, 70);
         doc.text(`Date : ${format(data.transactiondate, 'dd-MM-yyyy')}`, 150, 70);
         // headMenus();
       },
       margin: { top: 75, right: 5, left: 5 },
     });
 
     doc.autoTable({
         columns: [
             { header: 'Disetujui,', dataKey: 'disetujui' },
             { header: 'Diperiksa,', dataKey: 'diperiksa' },
             { header: 'Diterima,', dataKey: 'diterima' },
         ],
         body: [
             { disetujui: '', diperiksa: '', diterima: '' }, // Ini adalah baris kosong untuk tanda tangan
         ],
         foot: [
             { disetujui: 'General Manager', diperiksa: 'KTU', diterima: 'KaBag. Gudang' },
         ],
         headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign:'center'},
         bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, cellPadding:Padding=10},
         footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign:'center' },
         startY: doc.lastAutoTable.finalY + 10,
         theme: 'grid',
         margin: { top:15,right:doc.internal.pageSize.width/5,left:doc.internal.pageSize.width/5},
         columnStyles: {
             disetujui: { cellWidth: doc.internal.pageSize.width/5 }, // Atur lebar kolom Disetujui
             diperiksa: { cellWidth: doc.internal.pageSize.width/5 }, // Atur lebar kolom Diperiksa
             diterima: { cellWidth: doc.internal.pageSize.width/5 }, // Atur lebar kolom Diterima
         },
     });
 
     // doc.setFontSize(11);
     // doc.setFont("helvetica", "bold");
 
 
 
     // doc.text("Prepared By", 20, doc.lastAutoTable.finalY + 20);
     // var lineWidth = 0.5;
     // doc.setLineWidth(lineWidth);
     // var startPointX = 18;
     // var startPointY =  doc.lastAutoTable.finalY + 40;
     // var lineLength = 35;
     // doc.line(startPointX, startPointY, startPointX + lineLength, startPointY);
     // // doc.text("General Manager", 20, 260);
 
     // doc.text("Reviewed By", 90,  doc.lastAutoTable.finalY + 20);
     // var lineWidth = 0.5;
     // doc.setLineWidth(lineWidth);
     // var startPointa = 89;
     // var startPointb =  doc.lastAutoTable.finalY + 40;
     // var lineLengthc= 35;
     // doc.line(startPointa, startPointb, startPointa + lineLengthc, startPointb);
     // // doc.text("KTU", 90, 260);
     
     // doc.text("Approved By", 160,  doc.lastAutoTable.finalY + 20);
     // var lineWidth = 0.5;
     // doc.setLineWidth(lineWidth);
     // var startPointd = 157;
     // var startPointe =  doc.lastAutoTable.finalY + 40;
     // var lineLengthf= 35;
     // doc.line(startPointd, startPointe, startPointd + lineLengthf, startPointe);
     // doc.text("KaBag.Gudang", 160, 260);
 
     var pageCount = doc.internal.getNumberOfPages(); //Total Page Number
     for (i = 0; i < pageCount; i++) {
       doc.setPage(i);
       let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber; //Current Page
       doc.setFontSize(12);
       doc.text(
         "Page: " + pageCurrent + "/" + pageCount,
         doc.internal.pageSize.width - 25,
         doc.internal.pageSize.height - 5
       );
     }
 
 
 
     /*     doc.autoTable({
             head: headRows(),
             body: data.datadetail,
             startY: finalY + 10,
             theme: 'grid',
             //showHead: 'firstPage',
         })
      */
 
 }
 
 module.exports.get = get;
 