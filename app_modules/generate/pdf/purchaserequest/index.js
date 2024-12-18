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

 const _ = require("lodash");
 const fs = require("fs");
 const { jsPDF } = require("jspdf"); // will automatically load the node version
 require("jspdf-autotable");
 const { format } = require("date-fns");
 
 const db = require("./db");
 const { log } = require("console");
 
 
 async function getjson(req, res, next) {
 
 
   let responseResult, header, detail
 
   console.log(req.query)
 
 
   // DATA \\
   await db.fetchDataDynamic(req.user, req.query,
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
 
 module.exports.getjson = getjson;
 
 async function get(req, res, next) {
   let responseResult, header, detail;
 
 
   // DATA \\
   await db.fetchDataDynamic(req.user, req.query, (error, result) => {
     if (!_.isEmpty(error)) { responseResult = error; } else {
       header = _.map(result.rows, (c) => _.pickBy(c, (value, key) => key.indexOf("DETAIL#") === -1))[0];
       details = _.map(_.map(result.rows, (c) => _.pickBy(c, (value, key) => key.indexOf("DETAIL#") > -1)), (c) => _.mapKeys(c, (x, y) => y.replace("DETAIL#", "")));
 
 
       _.assignIn(header, { datadetail: details });
 
       responseResult = header;
     }
   });
 
   // PRINT PDF \\
   let pdfFilename = `output/${req.query.reportname}.pdf`;
 
   res.setHeader("Content-disposition", `attachment; filename=${pdfFilename}`);
   res.setHeader("Content-type", "application/pdf");
 
   const doc = new jsPDF({ orientation: "landscape", format: "a4", compress: true, unit: "mm", });
 
   await printTable(doc, responseResult);
 
   // console.log(responseResult);
 
   doc.save(pdfFilename);
 
   // res.sendFile(responseResult)
 
   res.sendFile(pdfFilename, { root: "." }, (err) => {
     if (err) {
       console.log("Error sending PDF:", err);
       res.status(500).send("Error generating PDF");
     } else {
       console.log("PDF sent successfully");
     }
   });
 }
 
  function headRows() {
     return [
         {
             no: { content: 'No', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             itemcode: { content: 'Kode Barang', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             itemdescription: { content: 'Nama Barang', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             location: { content: 'Lokasi', colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             jobcode: { content: 'Aktivitas', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             jobdesc: { content: 'Deskripsi', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             qty: { content: 'Jumlah Diminta', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             approved_quantity: { content: 'On Hand', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             onhand: { content: 'On Hand', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             outstanding: { content: 'Out Standing', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             minmaxdesc: { content: 'Min/Max Desc', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             uomcode: { content: 'Satuan Ukuran', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             expectdate: { content: 'Tanggal Perlu', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             dayssiv: { content: 'Days SIV', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             destination: { content: 'Fr', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             keterangan: { content: 'Keterangan', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
         },
         [
             { content: 'Tipe', styles: { halign: 'center' } },
             { content: 'Kode', styles: { halign: 'center' } }
         ]
         
     ]
 }
 
 
 function bodyRows(datas) {
     rowCount = _.size(datas) || 10;
     var body = [];
     _.map(datas, (v, index) => {
       body.push([
         index + 1,
         v.itemcode,
         v.itemdescription,
         v.locationtype,
         v.locationcode,
         v.jobcode,
         v.jobdesc,
         v.quantity,
         v.approved_quantity,
         v.onhand,
         v.outstanding,
         [],
         v.uomcode,
         v.expectdate,
         v.dayssiv,
         v.destination,
         v.keterangan
       ]);
     });
     return body;
 }
 
 
 function printTable(doc, data) {
 
     let index = 5;
     let finalY = doc.lastAutoTable.finalY || index + 10
 
 
     // Styling Table \\
     doc.autoTableSetDefaults({
         headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2 },
         bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2 },
         footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign:'center' },
     })
     // Width Column Table \\
     // var columnwidth = {
     //     0: { cellWidth: 10 },
     //     1: { cellWidth: 30 },
     //     2: { cellWidth: 75 },
     //     3: { cellWidth: 20 },
     //     4: { cellWidth: 20 },
     //     5: { cellWidth: 0 },
     // };
 
 
     doc.autoTable({
         head: headRows(),
         body: bodyRows(data.datadetail),
         // foot: footRows(data),
         startY: finalY + 40,
         theme: 'grid',
         margin: { right: 5, left: 5, top: finalY + 40  },
         didParseCell: function(data){
             data.cell.styles.fontSize = 8.5
         }
         //showHead: 'firstPage',
     })
 
 
     // |============================= Signature Table ==================| \\
     const headerData = [
         [
             { content: 'Pemohon', colSpan: 1, styles: { halign: 'center' } },
             { content: 'Diperiksa', colSpan: 1, styles: { halign: 'center' } },
             { content: 'Disetujui', colSpan: 1, styles: { halign: 'center' } },
             { content: 'Disetujui', colSpan: 1, styles: { halign: 'center' } },
             { content: 'Disetujui', colSpan: 1, styles: { halign: 'center' } },
             { content: 'Disetujui', colSpan: 1, styles: { halign: 'center' } },
             { content: 'Disetujui', colSpan: 1, styles: { halign: 'center' } },
         ],
     ];
     
     //console.log( "sizeeeeeeeeeee",_.size(headerData) );
     
     // Bagian Body (untuk tanda tangan)
     const bodyData = [
         ['', '', '','', '', '', '']
     ];
     
     // Bagian Footer: Nama dan Tanggal (tersusun vertikal)
     const footerData = [
             ['', '', '','', '', '', 'BOD']
         ]


    

     // |============================= Signature Table 2 ==================| \\


    // const headerData2 = [
    //   [
    //     { content: 'Dikeluarkan', colSpan: 1, styles: { halign: 'center' } },
    //     { content: 'Diketahui', colSpan: 1, styles: { halign: 'center' } },
    //     { content: 'Diterima', colSpan: 1, styles: { halign: 'center' } },
    //   ],
    // ];
  
    // // Bagian Body (untuk tanda tangan)
    // const bodyData2 = [
    //   ['', '', '']
    // ];
  
    // // Bagian Footer: Nama dan Tanggal (tersusun vertikal)
    // const footerData2 = [
    //   [
    //     { content: `Tgl : ......................`, colSpan: 1, styles: { halign: 'center' } },
    //     { content: `Tgl : ......................`, colSpan: 1, styles: { halign: 'center' } },
    //     { content: `Tgl : ......................`, colSpan: 1, styles: { halign: 'center' } },
    //   ],
    //   [
    //     { content: 'Ka. Gudang', colSpan: 1 },
    //     { content: 'KTU', colSpan: 1 },
    //     { content: '.................................', colSpan: 1 },
    //   ],
  
    // ];

    

     
     doc.autoTableSetDefaults({
         headStyles: {  textColor: [0, 0, 0], },
         bodyStyles: {  textColor: [0, 0, 0], },
         footStyles: {  textColor: [0, 0, 0], halign:'center' },
     })
     
     const docWidth = doc.internal.pageSize.width/9
     doc.autoTable({
         head: headerData,
         body: bodyData,
         foot: footerData,
         margin: { left: docWidth, right: docWidth },
         bodyStyles: { cellPadding:10 },
         theme: 'plain',
         columnStyles: {
             0: { cellWidth: docWidth },
             1: { cellWidth: docWidth },
             2: { cellWidth: docWidth },
             3: { cellWidth: docWidth },
             4: { cellWidth: docWidth },
             5: { cellWidth: docWidth },
             6: { cellWidth: docWidth },
         },
         didParseCell: function (data) {
             data.cell.styles.fontSize = 7;
         }
     });
     
     const font = "helvetica";
     const titleSize = 16;
     const subtitleSize = 14;
     const remarkdocumentSize = 7;
     const headerSize = 8;
     const leftColumnX = doc.internal.pageSize.width - 220;
     const rightColumnX = doc.internal.pageSize.width / 2;
     const RemarkDocX = doc.internal.pageSize.width - 50;
     /*Remarks Document*/
   
     // Label And Value Remark Document , Left Segment, Right Segment \\
     const remarksForm = [
       //{ label: "Form. SPP Rev.01"},
       { label: "Original", value: "Procurement" },
       { label: "Copy 1", value: "Peminta" },
   
     ];
   
     const remarksDocument = [
       { label: "Print By", value: "" },
       { label: "Print Date", value: `${format(new Date(), "dd-MM-yyyy hh:mm")}` },
       { label: "File Name", value: "Stores Issue Voucher" },
       { label: "Page", value: "", x: 173.6 },
     ];
   
   
     const labelValueLeftColumn = [
       { label: "No", value: `${data.prcode}` },
       { label: "Tanggal", value: `${data.prdate}` },
       { label: "Gudang / User", value: `${data.prrequestfrom}` },
       { label: "Catatan", value: `${data.prnotes}` },
   
     ];
     const labelValueRightColumn = [
       { label: "Priority", value: `${data.prpriority}` },
     ]
   
     /* Set Length Variable For Remark Document , left Segment */
     let maxWidthRemarkDoc = 0;
     let maxWidthLeftColumn = 0;
     let maxWidthRightColumn = 0;
   
     /* calculte max width remark doc, left segment */
   
     remarksForm.forEach(({ label }) => {
       const labelWidth =
         (doc.getStringUnitWidth(label) * remarkdocumentSize) /
         doc.internal.scaleFactor;
       if (labelWidth > maxWidthRemarkDoc) {
         maxWidthRemarkDoc = labelWidth;
       }
     });
   
     remarksDocument.forEach(({ label }) => {
       const labelWidth =
         (doc.getStringUnitWidth(label) * remarkdocumentSize) /
         doc.internal.scaleFactor;
       if (labelWidth > maxWidthRemarkDoc) {
         maxWidthRemarkDoc = labelWidth;
       }
     });
   
     labelValueLeftColumn.forEach(({ label }) => {
       const labelwidth = doc.getStringUnitWidth(label) * headerSize / doc.internal.scaleFactor;
       if (labelwidth > maxWidthLeftColumn) {
         maxWidthLeftColumn = labelwidth;
       }
     })
   
     labelValueRightColumn.forEach(({ label }) => {
       const labelwidth = doc.getStringUnitWidth(label) * headerSize / doc.internal.scaleFactor;
       if (labelwidth > maxWidthRightColumn) {
         maxWidthRightColumn = labelwidth;
       }
     })
   
   
   
     function drawRemarksForm(doc, remarksForm) {
   
       let currentRemarkF = 7;
   
       remarksForm.forEach(({ label, value }) => {
         doc.setFontSize(remarkdocumentSize);
         doc.setFont(font, "normal");
         doc.text(label, RemarkDocX, currentRemarkF);
         doc.text("=", RemarkDocX + maxWidthRemarkDoc + 2, currentRemarkF);
         doc.text(value, RemarkDocX + maxWidthRemarkDoc + 4, currentRemarkF);
         currentRemarkF += 4;
       });
   
   
     }
   
     function drawRemarksDoc(doc, remarksDocument) {
   
       let currentRemarkY = 30;
   
       remarksDocument.forEach(({ label, value }) => {
         doc.setFontSize(remarkdocumentSize);
         doc.setFont(font, "normal");
         doc.text(label, RemarkDocX, currentRemarkY);
         doc.text(":", RemarkDocX + maxWidthRemarkDoc + 2, currentRemarkY);
         doc.text(value, RemarkDocX + maxWidthRemarkDoc + 4, currentRemarkY);
         currentRemarkY += 4;
       });
     }
   
     function drawLeftColumn(doc, labelValueLeftColumn) {
       let currentLeftY = 23;
       labelValueLeftColumn.forEach(({ label, value }) => {
         doc.setFontSize(headerSize);
         doc.setFont(font, "bold");
         doc.text(label, leftColumnX, currentLeftY);
         doc.text(":", leftColumnX + maxWidthLeftColumn + 2, currentLeftY);
         doc.text(value, leftColumnX + maxWidthLeftColumn + 4, currentLeftY, { maxWidth: doc.internal.pageSize.width / 2.15, lineHeight: 1.2 });
         if (label === "Remarks PO") {
           const remarksPoOptions = { maxWidth: doc.internal.pageSize.width / 2.2 };
           const remarksPoHeight = doc.getTextDimensions(value, remarksPoOptions).h;
           currentLeftY += remarksPoHeight + 3.5;
         } else if (label === "Remarks GRN") {
           const remarksGrnOptions = { maxWidth: doc.internal.pageSize.width / 2.2 };
           const remarksGrnHeight = doc.getTextDimensions("Remarks GRN:", remarksGrnOptions).h;
           currentLeftY += remarksGrnHeight;
         } else {
           doc.setDrawColor(0, 0, 0);
           doc.setLineWidth(0.3);
           doc.line(leftColumnX + maxWidthLeftColumn + 4, currentLeftY + 1.5, doc.internal.pageSize.width / 2.10, currentLeftY + 1.5);
           currentLeftY += 7.5;
         }
       });
     }
   
     function drawRightColumn(doc, labelValueRightColumn) {
       let currentY = 23;
   
       labelValueRightColumn.forEach(({ label, value }) => {
         doc.setFontSize(headerSize);
         doc.setFont(font, "bold");
         doc.text(label, rightColumnX + 5, currentY);
         doc.text(":", rightColumnX + maxWidthLeftColumn + 7, currentY);
         doc.text(value, rightColumnX + maxWidthLeftColumn + 10, currentY, { maxWidth: doc.internal.pageSize.width / 2 });
         doc.setLineWidth(0.3);
         doc.line(rightColumnX + 5 + maxWidthLeftColumn + 4, currentY + 1.5, doc.internal.pageSize.getWidth() - 90, currentY + 1.5);
         currentY += 7.5;
       })
   
     }
   
     //  Kop, Remark Document,Header Data , pagination Loop \\\
     var pageCount = doc.internal.getNumberOfPages();
    //  var pageCountPlusOne = pageCount+1
     for (let i = 0; i < pageCount; i++) {
       doc.setPage(i);

       const pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
       remarksDocument.find((item) => item.label === "Page").value = `${pageCurrent} of ${pageCount}`;
      
       console.log('pageCurrent :', pageCurrent);
       // Draw Company Image Title ,SubTitle
   
       /* Company Image */
       let imgData = fs.readFileSync("./resources/ustp_small.png").toString("base64");
       doc.addImage(imgData, "PNG", 20, 7, 30, 30);
   
       /* Title */
       doc.setFont(font, "bold");
       doc.setFontSize(titleSize);
       doc.text("PT SUMBER MAHARDIKA GRAHA", 130, 10, null, null, 'center');
       doc.text("PUCHASE REQUEST", 130, 17, null, null, 'center');
   
   
       /* SubTitle Site Name */
       doc.setFontSize(subtitleSize);
       doc.setFont(font, "bold");
   
       drawRemarksForm(doc, remarksForm);
       drawRemarksDoc(doc, remarksDocument);
       drawLeftColumn(doc, labelValueLeftColumn);
       drawRightColumn(doc, labelValueRightColumn);
     }
     doc.addPage();

   
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
   {   
 
 
 }
 
 
 module.exports.get = get;
