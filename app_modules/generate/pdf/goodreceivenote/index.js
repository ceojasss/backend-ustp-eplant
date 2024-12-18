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

  const doc = new jsPDF({ orientation: "portrait", format: "a4", compress: true, unit: "mm", });

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
      no: { content: "Urut", colSpan: 1, styles: { halign: "center" } },
      purchaseitemcode: { content: "Kode Barang", colSpan: 1, styles: { halign: "center", valign: "middle" }, },
      itemdescription: { content: "Nama barang", colSpan: 1, styles: { halign: "center", valign: "middle" }, },
      quantity: { content: " Qty", colSpan: 1, styles: { halign: "center", valign: "middle" }, },
      unitofmeasuredesc: { content: "Satuan", colSpan: 1, styles: { halign: "center", valign: "middle" }, },
      loc: { content: "Keterangan", colSpan: 1, styles: { halign: "center", valign: "middle" }, },
    },
  ];
}

// Function For Body Table \\
function bodyRows(datas) {
  rowCount = _.size(datas) || 10;
  var body = [];
  _.map(datas, (v, index) => {
    body.push([index + 1, v.purchaseitemcode, v.itemdescription, v.quantity, v.unitofmeasuredesc, v.loc,]);
  });
  return body;
}

// Function For Print The Table \\
function printTable(doc, data) {

  // console.log("Lebar", doc.internal.pageSize.width); //  210.0015555555555
  // console.log("Tinggi", doc.internal.pageSize.height); // 297.0000833333333


  let index = 20;

  let finalY = doc.lastAutoTable.finalY || index + 20;


  // Styling Table \\
  doc.autoTableSetDefaults({
    headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2, },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2, },
  });
  // Print Table \\
  doc.autoTable({
    head: headRows(),
    body: bodyRows(data.datadetail),
    startY: finalY + 45,
    startx: 10,
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 30 },
      2: { cellWidth: 75 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 0 },
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
  const signatureY = doc.lastAutoTable.finalY;

  // Signature form \\
  doc.autoTable({
    columns: [
      { header: "Disetujui,", dataKey: "disetujui" },
      { header: "Diperiksa,", dataKey: "diperiksa" },
      { header: "Diterima,", dataKey: "diterima" },
    ],
    body: [
      { disetujui: "", diperiksa: "", diterima: "" }, // Ini adalah baris kosong untuk tanda tangan
    ],
    foot: [
      { disetujui: "General Manager", diperiksa: "KTU", diterima: "KaBag. Gudang", },
    ],
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: "center", },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, cellPadding: (innerHeight = 10), },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: "center", },
    startY: signatureY >= 240 ? signatureY + 50 : signatureY + 7,
    theme: "grid",
    margin: { top: finalY + 40, right: doc.internal.pageSize.width / 5, left: doc.internal.pageSize.width / 5, },
    columnStyles: {
      disetujui: { cellWidth: doc.internal.pageSize.width / 5 }, // Atur lebar kolom Disetujui
      diperiksa: { cellWidth: doc.internal.pageSize.width / 5 }, // Atur lebar kolom Diperiksa
      diterima: { cellWidth: doc.internal.pageSize.width / 5 }, // Atur lebar kolom Diterima
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
  const leftColumnX = doc.internal.pageSize.width - 205.0015555555555;
  const rightColumnX = doc.internal.pageSize.width / 2;
  const RemarkDocX = doc.internal.pageSize.width - 50;
  /*Remarks Document*/

  // Label And Value Remark Document , Left Segment, Right Segment \\
  const remarksDocument = [
    { label: "Print By", value: "" },
    { label: "Print Date", value: `${format(new Date(), "dd-MM-yyyy hh:mm")}` },
    { label: "File Name", value: "Receive Note" },
    { label: "Page", value: "", x: 173.6 },
  ];
  const labelValueLeftColumn = [
    { label: "Nama Supplier", value: `${data.supplierdesc}` },
    { label: "Nomor Surat Jalan", value: `${data.suratjalan}` },
    { label: "Nomor PO", value: `${data.po}` },
    { label: "Nomor PR", value: `${data.pr}` },
    { label: "Remarks PO", value: `${data.remarkspo}` },
    { label: "Remarks GRN", value: `${data.remarksgrn}` },
  ];
  const labelValueRightColumn = [
    { label: "Tgl Penerimaan", value: `${data.tanggal}` },
    { label: "Nomor BPB", value: `${data.nomorbpb}` },
    { label: "Lokasi Gudang", value: `${data.lokasi}` }
  ]

  /* Set Length Variable For Remark Document , left Segment */
  let maxWidthRemarkDoc = 0;
  let maxWidthLeftColumn = 0;
  let maxWidthRightColumn = 0;

  /* calculte max width remark doc, left segment */
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

  function drawRemarksDoc(doc, remarksDocument) {

    let currentRemarkY = 10;

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
    let currentLeftY = 35;
    labelValueLeftColumn.forEach(({ label, value }) => {
      doc.setFontSize(headerSize);
      doc.setFont(font, "normal");
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
        doc.line(leftColumnX + maxWidthLeftColumn + 4, currentLeftY + 1.5, doc.internal.pageSize.width / 2.00, currentLeftY + 1.5);
        currentLeftY += 7.5;
      }
    });
  }

  function drawRightColumn(doc, labelValueRightColumn) {
    let currentY = 35;

    labelValueRightColumn.forEach(({ label, value }) => {
      doc.setFontSize(headerSize);
      doc.setFont(font, "normal");
      doc.text(label, rightColumnX + 5, currentY);
      doc.text(":", rightColumnX + 3 + maxWidthLeftColumn + 2, currentY);
      doc.text(value, rightColumnX + 5 + maxWidthLeftColumn + 4, currentY, { maxWidth: doc.internal.pageSize.width / 2 });
      doc.setLineWidth(0.3);
      doc.line(rightColumnX + 5 + maxWidthLeftColumn + 4, currentY + 1.5, doc.internal.pageSize.getWidth() - 10, currentY + 1.5);
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
    doc.addImage(imgData, "PNG", 15, 2, 20, 25);

    /* Title */
    doc.setFont(font, "bold");
    doc.setFontSize(titleSize);
    doc.text("BUKTI PENERIMAAN BARANG", 105, 10, null, null, "center");
    doc.text("(BPB)", 105, 17, null, null, "center");

    /* SubTitle Site Name */
    doc.setFontSize(subtitleSize);
    doc.setFont(font, "bold");
    doc.text("PT GRAHA CAKRA MULIA", 105, 25, null, null, "center");

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
