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

  res.send(responseResult)


}

module.exports.getjson = getjson;

async function get(req, res, next) {
  let responseResult, header, detail;

  // console.log(req.query)

  // DATA \\
  await db.fetchDataDynamic(req.user, "", (error, result) => {
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



// Function Header Table \\
function headRows() {
  return [
    {
      no: { content: 'No', rowSpan: 2, styles: { halign: 'center' } },
      kodeunit: { content: 'Kode Unit', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      jumlahdiminta: { content: 'Jumlah \n Diminta', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      sudahkeluar: { content: 'Sudah \n keluar', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      keluarsekarang: { content: 'Keluar \n Sekarang', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      sisa: { content: 'Sisa', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      uom: { content: 'Satuan \n Ukuran', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      kmhm_mr: { content: 'KM/HM \n Mr', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      kmhm: { content: 'KM/HM \n Pengisian', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      no_job_order: { content: 'No Job Order', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      remarks: { content: 'Keterangan', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    },

    [
      { content: '', styles: { halign: 'center' } },
      { content: '', styles: { halign: 'center' } },
    ]
  ]
}


function subBody(datas) {
  return [
    {
      no: { content: 'Subtotal : ', colSpan: 2, styles: { halign: 'right', fontStyle: 'bold'} },
      jumlahdiminta: { content: datas.jumlahdiminta },
      sudahkeluar: { content: datas.sudahkeluar },
      keluarsekarang: { content: datas.keluarsekarang },
      sisa: { content: datas.sisa },
      uom: { content: '', colSpan: 5 },
    }
  ]
}

function bodyRows(datas) {
  var groupedData = _.groupBy(datas, 'kodebarang');
  var rowCount = _.size(datas) || 10;
    var body = [];
    var noUrut = 0;
    var kodebarangSudahDicetak = [];


    _.forEach(groupedData, (group, kodebarang) => {
        noUrut++;
        var grouping = group[0];
        var kodebarang = { content: grouping.kodebarang };
        // console.log('kode barang : ',kodebarang);


        var namabarang = { content: grouping.namabarang };
        // console.log('namabarang : ',namabarang);

        _.forEach(group, (v, index) => {
            // const issued_qty = _.isNull(v.issued_qty) ? '0' : v.issued_qty;

            
            // console.log('v :',v);
            body.push([
                index === 0 ? { content: noUrut.toString() } : { content: '' },
                // index === 0 ? kodebarang : { content: '' },
                // index === 0 ? namabarang : { content: '' },
                // { content: v.locationtype },
                { content: v.locationcode },
                // { content: v.jobcode },
                { content: v.jumlahdiminta },
                { content: v.sudahkeluar },
                { content: v.keluarsekarang },
                { content: v.sisa },
                { content: v.uom },
                { content: '' },
                { content: v.kmhm },
                { content: '' },
                { content: v.remarks },
            ]);
        });


        var subBodyData = subBody(grouping);
        body = body.concat(subBodyData);
        
       
    });
    
        

   
    // console.log('groupedData : ',groupedData);
    

    return body;

}


// // Function For Body Table \\
// function bodyRows(datas) {
//   console.log('Banyak Data : ', datas.length);
//   // var gabung = gabungRowSpan()

//   rowCount = _.size(datas) || 7;
//   var body = [];

//   _.map(datas, (v, index) => {

//     // if (index % 2 === 1) {
//     //   let previousObj = datas[index - 1];
//     //   if (v.kodebarang === previousObj.kodebarang) {
//     //     console.log('sama');
//     //   } else {
//     //     console.log('tidak sama');
//     //   }
//     // }  

//     var noUrut = [index + 1]
//     // var kodebarang = [v.kodebarang]
//     // var kodebarang = { content: kodebarang, rowSpan: 2 }
//     // var namabarang = [v.namabarang]
//     // var namabarang = { content: namabarang, rowSpan: 2 }

//     body.push([noUrut, v.locationcode,
//       v.jumlahdiminta, v.sudahkeluar, v.keluarsekarang, v.sisa, v.uom, v.kmhm_mr, v.kmhm, v.no_job_order, v.remarks]);
//     var subBodyData = subBody(v);

//     body = body.concat(subBodyData);




//   });

//   return body;
// }


function footerRows(datas) {
  return [
    {
      no: { content: 'Sub Total:', colSpan: 2, styles: { halign: 'right' } },
      jumlahdiminta: { content: datas.sum_jumlahdiminta },
      sudahkeluar: { content: datas.sum_sudahkeluar },
      keluarsekarang: { content: datas.sum_keluarsekarang },
      sisa: { content: datas.sum_sisa },
      uom: { content: '', colSpan: 5},
    }
  ]
}



// Function For Print The Table \\
function printTable(doc, data) {

  // console.log("Lebar", doc.internal.pageSize.width); //  210.0015555555555
  // console.log("Tinggi", doc.internal.pageSize.height); // 297.0000833333333


  let index = 0;

  let finalY = doc.lastAutoTable.finalY || index + 5;


  // Styling Table \\
  doc.autoTableSetDefaults({
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2, },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2, },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2, },
  });
  // Print Table \\
  doc.autoTable({
    head: headRows(),
    body: bodyRows(data.datadetail),
    // foot: footerRows(data),
    startY: finalY + 45,
    startx: 10,
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 35 },
      2: { cellWidth: 15 },
      3: { cellWidth: 15 },
      4: { cellWidth: 20 },
      5: { cellWidth: 15 },
      6: { cellWidth: 15 },
      7: { cellWidth: 25 },
      8: { cellWidth: 25 },
    },
    theme: "grid",
    // Function Custom Align Index Table 0 & 3\\
    didParseCell: function (data) {
      if (data.section === "body" && data.column.index === 3) {
        data.cell.styles.halign = "right";
      }
      if (data.section === "body" && data.column.index === 0) {
        data.cell.styles.halign = "center";
      }
      data.cell.styles.fontSize = 8;
    },
    margin: { right: 5, left: 5, top: finalY + 40 },
  });



  // set Coordinate for signature form \\
  // console.log(' tergambar  :', doc.lastAutoTable.finalY)

  const signatureY = doc.lastAutoTable.finalY;

  //  console.log('signatureY : ',signatureY);
  // Signature form \\
  const headerData = [
    [
      { content: 'Dikeluarkan', colSpan: 1, styles: { halign: 'center' } },
      { content: 'Diketahui', colSpan: 1, styles: { halign: 'center' } },
      { content: 'Diterima', colSpan: 1, styles: { halign: 'center' } },
    ],
  ];

  // Bagian Body (untuk tanda tangan)
  const bodyData = [
    ['', '', '']
  ];

  // Bagian Footer: Nama dan Tanggal (tersusun vertikal)
  const footerData = [
    [
      { content: `Tgl : ......................`, colSpan: 1, styles: { halign: 'center' } },
      { content: `Tgl : ......................`, colSpan: 1, styles: { halign: 'center' } },
      { content: `Tgl : ......................`, colSpan: 1, styles: { halign: 'center' } },
    ],
    [
      { content: 'Ka. Gudang', colSpan: 1 },
      { content: 'KTU', colSpan: 1 },
      { content: '.................................', colSpan: 1 },
    ],

  ];
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 50,
    head: headerData,
    body: bodyData,
    foot: footerData,
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: "center", },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, cellPadding: (innerHeight = 10), },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: "center", },
    startY: signatureY >= 143 ? signatureY + 70 : signatureY + 10,
    theme: "grid",
    margin: { top: finalY + 40, left: 5 },
    columnStyles: {
      0: { cellWidth: doc.internal.pageSize.width / 6 }, // Atur lebar kolom dikeluarkan
      1: { cellWidth: doc.internal.pageSize.width / 6 }, // Atur lebar kolom Diperiksa
      2: { cellWidth: doc.internal.pageSize.width / 6 } // Atur lebar kolom Diterima
    },
    didParseCell: function (data) {
      data.cell.styles.fontSize = 10;
    },
  });

  ///// Header Data \\\\


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
    { label: "Form BMK", value: "Rev. 01" },
    { label: "Original", value: "Gudang" },
    { label: "Copy 1", value: "Peminta" },
    { label: "Copy 2", value: "Keuangan" },
  ];

  const remarksDocument = [
    { label: "Print By", value: "" },
    { label: "Print Date", value: `${format(new Date(), "dd-MM-yyyy hh:mm")}` },
    { label: "File Name", value: "Stores Issue Voucher" },
    { label: "Page", value: "", x: 173.6 },
  ];


  const labelValueLeftColumn = [
    { label: "No", value: `${data.sivcode}` },
    { label: "Tanggal", value: `${data.tanggal}` },
    { label: "Gudang", value: `${data.gudang}` },

  ];
  const labelValueRightColumn = [
    { label: "MR", value: `${data.mrcode}` },
    { label: "Peminta", value: `${data.peminta}` },
    { label: "Nama barang", value: `DA002001 / Minyak Solar Biodiesel B30` },

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
      doc.text(":", rightColumnX + maxWidthLeftColumn + 14, currentY);
      doc.text(value, rightColumnX + maxWidthLeftColumn + 17, currentY, { maxWidth: doc.internal.pageSize.width / 2 });
      doc.setLineWidth(0.3);
      doc.line(rightColumnX + 13 + maxWidthLeftColumn + 4, currentY + 1.5, doc.internal.pageSize.getWidth() - 60, currentY + 1.5);
      currentY += 7.5;
    })

  }

  //  Kop, Remark Document,Header Data , pagination Loop \\\
  var pageCount = doc.internal.getNumberOfPages();
  for (let i = 0; i < pageCount; i++) {
    doc.setPage(i);
    const pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
    remarksDocument.find((item) => item.label === "Page").value = `${pageCurrent} of ${pageCount}`;

    // Draw Company Image Title ,SubTitle

    /* Company Image */
    let imgData = fs.readFileSync("./resources/ustp_small.png").toString("base64");
    doc.addImage(imgData, "PNG", 20, 7, 30, 30);

    /* Title */
    doc.setFont(font, "bold");
    doc.setFontSize(titleSize);
    doc.text("PT GRAHA CAKRA MULIA", 130, 10, null, null, 'center');
    doc.text("STORE ISSUE VOUCHER", 130, 17, null, null, 'center');

    /* SubTitle Site Name */
    doc.setFontSize(subtitleSize);
    doc.setFont(font, "bold");

    drawRemarksForm(doc, remarksForm);
    drawRemarksDoc(doc, remarksDocument);
    drawLeftColumn(doc, labelValueLeftColumn);
    drawRightColumn(doc, labelValueRightColumn);
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
{

}

module.exports.get = get;
