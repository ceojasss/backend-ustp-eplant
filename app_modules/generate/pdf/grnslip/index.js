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
 const { format } = require('date-fns');
 
 const db = require('./db');
 const { fontSize, font } = require('pdfkit');
 const { signedCookies } = require('cookie-parser');
 const { log } = require('console');
 // const { log } = require('console');
 
 
 async function get(req, res, next) {
 
 
     let responseResult, header, detail
 
     // console.log(req.query)
 
 
     // DATA \\
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
 
     // PRINT PDF \\
     let pdfFilename = `output/${req.query.reportname}.pdf`
 
     res.setHeader('Content-disposition', `attachment; filename=${pdfFilename}`);
     res.setHeader('Content-type', 'application/pdf');
 
 
     const doc = new jsPDF({ orientation: "portrait", format:'a4',compress: true, unit:'mm' });
 
 
     await printTable(doc, responseResult);
 
     // console.log(responseResult);
 
     //  printTableSign(doc);
 
 
     doc.save(pdfFilename)
 
 
     // res.sendFile(responseResult)
 
     res.sendFile(pdfFilename, { root: '.' }, (err) => {
         if (err) {
             console.log('Error sending PDF:', err);
             res.status(500).send('Error generating PDF');
         } else {
             console.log('PDF sent successfully');
         }
     });
 }
 
 
 // Function HeadRows Table \\
 function headRows() {
     return [
         {
             no: { content: 'Urut', colSpan: 1, styles: { halign: 'center' } },
             purchaseitemcode: { content: 'Kode Barang', colSpan: 1, styles: { halign: 'center',valign:'middle' } },
             itemdescription: { content: 'Nama barang', colSpan: 1, styles: { halign: 'center', valign: 'middle' } },
             quantity: {content: ' Qty', colSpan: 1, styles: { halign: 'center', valign: 'middle' } },
             unitofmeasuredesc: { content: 'Satuan', colSpan: 1, styles: { halign: 'center', valign: 'middle' } },
             loc: { content: 'Keterangan', colSpan: 1, styles: { halign: 'center', valign: 'middle' } },
             // amount: { content: 'Jumlah', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
         },
     ]
 }
 // Function For BodyRows Table \\
 function bodyRows(datas) {
     rowCount = _.size(datas) || 10
     var body = []
     _.map(datas, (v,index) => {
         body.push([index+1,v.purchaseitemcode, v.itemdescription,v.quantity , v.unitofmeasuredesc, v.loc])
     })
 /*     for (var j = 1; j <= rowCount; j++) {
         body.push({
             locationtype: 'tipe', locationcode: 'kode', account: 'Account', reference: 'Account Description', cfcode: 'Kode C/F', remarks: 'Uraian', amount: 'jumlah'
         })
     }
  */    return body
 }
 // Function For Print The Table \\
 function printTable(doc, data) {
 
     let index=20;
     let finalY = doc.lastAutoTable.finalY || index + 20
 
     // Styling Table \\
     doc.autoTableSetDefaults({
         headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0],lineColor :[0,0,0], lineWidth:0.2},
         bodyStyles: {fillColor: [255, 255, 255],textColor: [0, 0, 0],lineColor :[0,0,0], lineWidth:0.2},
     })
     // Width Column Table \\
     var columnwidth = {
         0: { cellWidth: 10},
         1: { cellWidth: 30},
         2: { cellWidth: 75},
         3: { cellWidth: 20},
         4: { cellWidth: 20},
         5: { cellWidth: 0},
     };
 
     // Print Table \\
     doc.autoTable({
         head: headRows(),
         body: bodyRows(data.datadetail),
         startY: finalY+42,
         startx: 10,
         columnStyles: columnwidth,
         theme: 'grid',
 
         // Function Custom Align Index Table 0 & 3\\
         didParseCell: function(data) {
             if (data.section === 'body' && data.column.index === 3) {
                 data.cell.styles.halign = 'right';
             }
             if (data.section === 'body' && data.column.index === 0) {
                 data.cell.styles.halign = 'center';
             }
             data.cell.styles.fontSize = 8;
         },
 
         // Function For loop KopDocument And Header Data \\
         didDrawPage : function  () {

             // console.log("Lebar", doc.internal.pageSize.width); //  210.0015555555555
             // console.log("Tinggi", doc.internal.pageSize.height); // 297.0000833333333
 
 
 
             const marginKanan = doc.internal.pageSize.width-205  ;
             const marginKiriRemarkDoc = doc.internal.pageSize.width-50  ;
 
             // console.log(marginKiri);
 
             const font ="helvetica";
             
             const titleSize=16;
             const subtitleSize=14;
             const remarkdocumentSize=7;
             const headerSize = 8;
     
 
             {/* Company Image */}
             let imgData = fs.readFileSync('./resources/ustp_small.png').toString('base64');
             doc.addImage(imgData, "PNG", 15, 2, 20, 25);
 
             {/* Title */}
             doc.setFont(font, "bold");
             doc.setFontSize(titleSize);
             doc.text("BUKTI PENERIMAAN BARANG", 105, 10, null, null, 'center');
             doc.text("(BPB)", 105, 17, null, null, 'center');
 
             {/* SubTitle Site Name */}
             doc.setFontSize(subtitleSize);
             doc.setFont(font, "bold");
             doc.text("PT GRAHA CAKRA MULIA", 105,25, null, null, 'center');
 
             {/* Remarks Document */}
             const remarksDocument=[
                 { label: "Print By", value: "" },
                 { label: "Print Date", value: `${format(new Date(),'dd-MM-yyyy hh:mm')}`,},
                 { label: "File Name", value: "Receive Note" },
             ]
 ///////////////////// Remark Document \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
             let maxLabelWidthRemarksDoc =0;
 
             remarksDocument.forEach(({ label }) => {
                 const labelWidth = doc.getStringUnitWidth(label) * remarkdocumentSize / doc.internal.scaleFactor;
                 if (labelWidth > maxLabelWidthRemarksDoc) {
                     maxLabelWidthRemarksDoc = labelWidth;
                 }
             });
             
 
             let   currentRemarkY = 10;
             const remarkX = marginKiriRemarkDoc;
             const colonRemark = remarkX + maxLabelWidthRemarksDoc + 2;
             const dataRemark = colonRemark + 2;
 
             // console.log("RemarkX",remarkX);
             // console.log("Colon Remark",colonRemark);
             // console.log("Data Remark",dataRemark);
 
             remarksDocument.forEach(({ label, value }) => {
                 doc.setFontSize(remarkdocumentSize);
                 doc.setFont(font,"normal")
                 doc.text(label, remarkX, currentRemarkY);
                 doc.text(':', colonRemark, currentRemarkY);
                 doc.text(value, dataRemark, currentRemarkY);
                 currentRemarkY += 4;
             });
 ///////////////////// Remark Document \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 
 
 /////////////////////// Header Data Document \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
             {/* Font Size Header */}
             doc.setFontSize(headerSize);
         
             {/* Set Variable For Max Label Each Segment */}
             let maxLabelWidthLeft = 0;
             let maxLabelWidthRight = 0;
 
              {/* Value And Label Left Segment*/}
             const labelValueLeftColumn = [
                 { label: "Nama Supplier", value: `${data.supplierdesc}` },
                 { label: "Nomor Surat Jalan", value: `${data.suratjalan}` },
                 { label: "Nomor PO", value: `${data.po}` },
                 { label: "Nomor PR", value: `${data.pr}` },
                 { label: "Remarks PO", value: `${data.remarkspo}` },
                 { label: "Remarks GRN", value: `${data.remarksgrn}` },
 
             ];  

             
 
             {/* Value And Label Right Segment*/}
             const labelValueRightColumn = [
                 { label: "Tgl Penerimaan", value: `${data.tanggal}` },
                 { label: "Nomor BPB", value: `${data.nomorbpb}` },
                 { label: "Lokasi Gudang", value: `${data.lokasi}` }
             ];
 
             {/* Calculate Max Width Of Label Left Segement*/}
             labelValueLeftColumn.forEach(({ label }) => {
                 const labelWidth = doc.getStringUnitWidth(label) * headerSize / doc.internal.scaleFactor;
                 if (labelWidth > maxLabelWidthLeft) {
                     maxLabelWidthLeft = labelWidth;
                 }
             });
            
             {/* Calculate Max Width Of Label Right Segement*/}
             labelValueRightColumn.forEach(({ label }) => {
                 const labelWidth = doc.getStringUnitWidth(label) * headerSize / doc.internal.scaleFactor;
                 if (labelWidth > maxLabelWidthRight) {
                     maxLabelWidthRight = labelWidth;
                 }
             });
 
             {/* Set Coordinates Var for Left Segment*/}
             let currentleftY = 40;
             const leftlabelX = marginKanan;
             const colonLeft = leftlabelX + maxLabelWidthLeft + 5;
             const dataLeft = colonLeft + 3;
             
             console.log("Garis",dataLeft+doc.internal.pageSize.width/2.03);
             // console.log("Butuh",dataLeft+doc.internal.pageSize.width/2.03);
            
 
 
 
 
 
              {/* Draw Label,colon and Data Left Segment */}
             labelValueLeftColumn.forEach(({ label, value }) => {
                 doc.text(label, leftlabelX, currentleftY);
                 doc.text(':', colonLeft, currentleftY);
                 doc.text(value, dataLeft, currentleftY,{maxWidth:doc.internal.pageSize.width/1.6});   ///2.6
                 if (label !== "Remarks PO" && label !== "Remarks GRN") {
                     doc.setLineWidth(0.3);
                     doc.line(dataLeft, currentleftY + 1.5, doc.internal.pageSize.width / 2.03, currentleftY + 1.5);
                 }
                 currentleftY += 7.5;
             });
 
              {/* Set Coordinates Var for Right Segment*/}
             let currentrightY = 40;
             const rightlabelX = leftlabelX + maxLabelWidthLeft + 80;
 
 
             const colonRightX = rightlabelX + 28;
             const dataRight = colonRightX + 3;
 
     
 
 
             {/* Draw Label,colon and Data Right Segment */}
             labelValueRightColumn.forEach(({ label, value }) => {
                 doc.text(label, rightlabelX, currentrightY);
                 doc.text(':', colonRightX, currentrightY);
                 doc.text(value, dataRight, currentrightY);
                 doc.setDrawColor(0,0,0);
                 doc.setLineWidth(0.3);
                 doc.line(dataRight, currentrightY+1.5, dataRight+40, currentrightY+1.5);
                 currentrightY += 7;
             });
 
 /////////////////////// Header Data Document \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 
         },
         margin:{right:5,left:5,top:82},
         
     })
 
     // Signature form \\
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
 
     
     
 
     // Pagination \\
 
     var pageCount = doc.internal.getNumberOfPages();
     for (i = 0; i < pageCount; i++) {
       doc.setPage(i);
       let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber; // Current Page
       doc.setFontSize(7);
       doc.setFont("helvetica","normal");
       doc.text("Page", 100, 22);
       doc.text(':',  173.60, 22);
       doc.text(pageCurrent + " of " + pageCount, 175.60, 22);
 
     }
     
 
     /*     doc.autoTable({
             head: headRows(),
             body: data.datadetail,
             startY: finalY + 10,
             theme: 'grid',
             //showHead: 'firstPage',
         })
      */
         // return currentleftY;
 }
 {/* Bagian Tabel Data */}
 
 
 
 
 
 
 module.exports.get = get;