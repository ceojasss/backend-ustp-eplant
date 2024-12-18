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

const db = require('./db');
const { setReportName, initBuildReport, ConstantsObject, ReportHeader, DocumentProperties, Constants } = require('../reporthelper');


// const {} = require('../../../listofvalues/index')


async function get(req, res, next) {
    let responseResult, header, detail, responseResultApp;


    // ? Data Tabel Detail
    await db.fetchDataDynamic(req.user, req.query, (error, result) => {
        if (!_.isEmpty(error)) { responseResult = error; } else {
            header = _.map(result.rows, (c) => _.pickBy(c, (value, key) => key.indexOf("DETAIL#") === -1))[0];
            details = _.map(_.map(result.rows, (c) => _.pickBy(c, (value, key) => key.indexOf("DETAIL#") > -1)), (c) => _.mapKeys(c, (x, y) => y.replace("DETAIL#", "")));


            _.assignIn(header, { datadetail: details });

            responseResult = header;
        }
    });


    // ? Data Aprroval Signature
    await db.fetchDataApproval(req.user, "", (error, result) => {
        if (!_.isEmpty(error)) {
            responseResultApp = error;
        } else {
            const groupedData = {
                headers: [],
                body: [],
                footers: [],
                status: [],
                date: [],
            };

            result.rows.forEach(row => {
                groupedData.headers.push(row.rce_name || 'N/A');
                groupedData.body.push(row.empname || 'N/A');
                groupedData.footers.push(row.jabatan || 'N/A');
                groupedData.status.push(row.status);
                groupedData.date.push(row.statusdate);
            });

            groupedData.columnLength = groupedData.headers.length;

            responseResultApp = groupedData;
        }
    });



    // Inisialisasi Report
    // 1. Set File
    // 2. set document Builder


    const pdfFilename = await setReportName(req, res)
    const doc = await initBuildReport(ConstantsObject.PORTRAIT_A4)
    const props = DocumentProperties.PORTRAIT_A4

    await printTable(doc, responseResult, responseResultApp);

    const title = req.query.reportname
    const site = req.user.sitename



    // ---------------------- Left Header Column ---------------------------- \\ 

    // ? Set Max Length Value Left Header Label
    let maxWidthLeftLabel = 0;

    // ? Label , : , And Value Left Header Column 
    const labelValueLeft = [
        { label: "Nama Supplier", value: `${responseResult.supplierdesc || '-'}` },
        { label: "Nomor Surat Jalan", value: `${responseResult.deliverycode || '-'}` },
        { label: "Nomor PO", value: `${responseResult.pocode || '-'}` },
        { label: "Nomor PR", value: `${responseResult.prcode || '-'}` },
        { label: "Remarks PO", value: `${responseResult.remarkspo || '-'}` },
        { label: "", value: `` },
        { label: "Remarks GRN", value: `${responseResult.remarksgrn || '-'}` },
        { label: "", value: `` },
    ]

    // ? Calculate max width of the label left header
    labelValueLeft.forEach(({ label }) => {
        const labelWidth = doc.getStringUnitWidth(label) * Constants.HEADER_FONT_SIZE / doc.internal.scaleFactor;
        if (labelWidth > maxWidthLeftLabel) {
            maxWidthLeftLabel = labelWidth;
        }
    })

    // ? Lebar Max Data Non RemarkPo & remarks Grn
    const maxWidthL = props.AlignCenterPosition


    // ? Draw Left Header

    // Start X
    const leftColumnX = doc.internal.pageSize.width - 205.0015555555555;

    function drawLeftColumn(doc, labelValueLeft) {
        let currentLeftY = 33;
        labelValueLeft.forEach(({ label, value }, index) => {
            doc.setFontSize(Constants.HEADER_FONT_SIZE - 2);
            doc.setFont(Constants.DEFAULT_FONT, "bold");
            doc.text(label, leftColumnX, currentLeftY);
            doc.text(":", maxWidthLeftLabel + 2, currentLeftY);
            doc.setFont(Constants.DEFAULT_FONT, "normal");


            if ((label === "Remarks PO" || label === "Remarks GRN") && index !== 1) {
                const maxWidth = props.AlignRightPosition - 30;
                const parts = doc.splitTextToSize(value, maxWidth);

                if (parts.length > 2) {
                    // Teks terlalu panjang, pindahkan elipsis ke baris kedua
                    doc.setLineWidth(0.3);
                    doc.text(parts[0], maxWidthLeftLabel + 4, currentLeftY, { maxWidth });
                    doc.text(parts[1], maxWidthLeftLabel + 4, currentLeftY + 5.5, { maxWidth });

                    // Hitung panjang teks yang tersisa dalam parts[1]
                    const remainingText = parts[1].substring(0, parts[1].length - 3); // Menghilangkan tiga karakter terakhir (elipsis)
                    const remainingTextWidth = doc.getStringUnitWidth(remainingText) * (Constants.HEADER_FONT_SIZE - 2) / doc.internal.scaleFactor;

                    doc.setFont(Constants.DEFAULT_FONT, "bold");
                    doc.setFontSize(Constants.HEADER_FONT_SIZE);
                    // Elipsis
                    doc.text('........', maxWidthLeftLabel + 10 + remainingTextWidth, currentLeftY + 5.5, { maxWidth: maxWidth });
                } else {
                    doc.text(parts[0], maxWidthLeftLabel + 4, currentLeftY, { maxWidth });
                    if (parts.length > 1) {
                        labelValueLeft[index + 1].value = parts.slice(1).join(" ");
                    }
                }
            } else {
                doc.text(value, maxWidthLeftLabel + 4, currentLeftY, { maxWidth: maxWidthL });
                const isLabelWithLine = index === 1 || index === 2 || index === 3 || index === 0;
                if (isLabelWithLine) {
                    doc.setLineWidth(0.3);
                    doc.setDrawColor(0, 0, 0);
                    doc.line(maxWidthLeftLabel + 4, currentLeftY + 1.5, props.AlignCenterPosition + 25, currentLeftY + 1);
                }
            }




            currentLeftY += 6;
        });
    }

    // ---------------------- Right Header Column ---------------------------- \\
    // ? Set Max Length Value Right Header Label
    let maxWidthRightLabel = 0;

    // ? Label , : , And Value Left Header Column 
    const labelValueRight = [
        { label: "Tgl Penerimaan", value: `${responseResult.rndate || '-'}` },
        { label: "Nomor BPB", value: `${responseResult.rncode || '-'}` },
        { label: "Lokasi Gudang", value: `${responseResult.franco || '-'}` },
    ]

    // ? Calculate max width of the label Right header
    labelValueRight.forEach(({ label }) => {
        const labelwidth = doc.getStringUnitWidth(label) * Constants.HEADER_FONT_SIZE / doc.internal.scaleFactor;
        if (labelwidth > maxWidthRightLabel) {
            maxWidthRightLabel = labelwidth;
        }
    })

    // ? Draw Right Column 
    const rightColumnX = props.AlignCenterPosition + 30
    function drawRightColumn(doc, labelValueRight) {
        let currentRightY = 33;
        labelValueRight.forEach(({ label, value }) => {
            doc.setFontSize(Constants.HEADER_FONT_SIZE - 2);
            doc.setFont(Constants.DEFAULT_FONT, "bold");
            doc.text(label, rightColumnX, currentRightY);
            doc.text(":", rightColumnX + maxWidthRightLabel, currentRightY);
            doc.setFont(Constants.DEFAULT_FONT, "normal");
            doc.text(value, rightColumnX + maxWidthRightLabel + 2, currentRightY, { maxWidth: doc.internal.pageSize.width / 2 });
            doc.setLineWidth(0.3);
            doc.setDrawColor(0, 0, 0);
            doc.line(rightColumnX + maxWidthRightLabel + 2, currentRightY + 1.5, doc.internal.pageSize.getWidth() - 10, currentRightY + 1.5);
            currentRightY += 6;

        })
    }




    // Opsi 1
    // ? Signature section
    const textY = doc.lastAutoTable.finalY;
    const positions = [7, 52, 99, 146];
    const labels = ['Signed Digitally', 'On ePlant'];


    function drawSignature(doc, x, date) {
        doc.setFontSize(13);
        doc.setTextColor(153, 153, 0);
        doc.setFont(Constants.DEFAULT_FONT, 'bold');
        doc.text(labels[0], x + 5, textY - 25);
        doc.text(labels[1], x + 11, textY - 20);
        doc.setFontSize(10);
        doc.text(`Date: ${date || 'N/A'}`, x + 1.5, textY - 15);
        doc.setTextColor(0, 0, 0);
    }

    function drawSignatureBlock(doc, x) {
        doc.setLineWidth(0.0);
        // doc.rect(x + 1, textY - 30, 41, 20);
    }

    function drawSign(doc, index) {
        const x = positions[index];

        const stat = responseResultApp.status[index]
        const date = responseResultApp.date[index]

        if (stat === 'A') {
            drawSignature(doc, x, date);
        }
    }

    const signCount = responseResultApp.columnLength


    // loop
    for (let i = 0; i < signCount; i++) {
        drawSign(doc, i);
    }






    for (i = 0; i < doc.internal.getNumberOfPages(); i++) {
        doc.setPage(i);

        //? WRITE HEADER DOCUMENT
        ReportHeader(doc, req, props, { title, site })
        let mTop = props.MarginTop
        let baris1 = mTop + 7
        let baris2 = mTop + 14
        let baris3 = mTop + 21

        // ? Title Document
        doc.setFont(Constants.DEFAULT_FONT, "bold");
        doc.setFontSize(Constants.TITLE_FONT_SIZE);
        doc.text(title, props.AlignCenterPosition, mTop, null, null, Constants.CENTER);
        doc.text("(BPB)", props.AlignCenterPosition, baris1, null, null, Constants.CENTER);
        doc.setFontSize(Constants.SUBTITLE_FONT_SIZE);
        doc.text(site, props.AlignCenterPosition, baris2, null, null, Constants.CENTER);

        // ? left Column Header
        drawLeftColumn(doc, labelValueLeft)
        drawRightColumn(doc, labelValueRight)

    }

    doc.save(pdfFilename);


    res.sendFile(pdfFilename, { root: "." }, (err) => {`1`
        if (err) {
            console.log("Error sending PDF:", err);
            res.status(500).send("Error generating PDF");
        } else {
            console.log("PDF sent successfully");
        }
    });


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

    function bodyRows(datas) {
        rowCount = _.size(datas) || 10;
        var body = [];
        _.map(datas, (v, index) => {
            body.push([index + 1, v.purchaseitemcode, v.itemdescription, v.quantity, v.unitofmeasuredesc, v.loc,]);
        });
        return body;
    }



    function printTable(doc, data) {


        let index = 20;
        let finalY = doc.lastAutoTable.finalY || index + 20
        const startXTableSign = 5


        //  ? Styling Table Detail
        doc.autoTableSetDefaults({
            headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2, },
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2, },
        });
        // ? Print Table Detail
        doc.autoTable({
            head: headRows(),
            body: bodyRows(data.datadetail),
            startY: finalY + 40,
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
                if (data.section === "body") {
                    switch (data.column.index) {
                        case 0:
                        case 4:
                            data.cell.styles.halign = "center";
                            break;
                        case 3:
                            data.cell.styles.halign = "right";
                            break;
                    }
                }
            },
            margin: { right: 5, left: 5, top: finalY + 40 },
        });
        // ? Set Vertical Coordinate For Signature Table
        const signatureY = doc.lastAutoTable.finalY;
        // ?  Set Cell Width
        const cellsWidth = doc.internal.pageSize.width / 4.5


        // ? Signature Table

        doc.autoTable({
            columns: responseResultApp.headers.map(header => ({ header })),
            body: [responseResultApp.body],
            foot: [responseResultApp.footers],
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: "center", cellWidth: cellsWidth },
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: "center", fontStyle: 'bold', valign: 'bottom', cellPadding: { top: 20, bottom: 0.5 }, cellWidth: cellsWidth },
            footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0], lineWidth: 0.2, halign: "center", cellWidth: cellsWidth },
            startY: signatureY >= 240 ? signatureY + 50 : signatureY + 7,
            theme: "grid",
            margin: { top: finalY + 40, left: startXTableSign },
            cellWidth: cellsWidth,
            columnStyles: {
                header: { cellWidth: cellsWidth },
                body: { cellWidth: cellsWidth },
                foot: { cellWidth: cellsWidth },
            },
            didParseCell: function (data) {
                data.cell.styles.fontSize = 9;
            },
        });





    }





}

module.exports.get = get;
