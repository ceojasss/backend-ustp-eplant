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
const PDFDocument = require('pdfkit');
const fs = require('fs')
const path = require('path')
const { PassThrough } = require("stream")

const router = require('express').Router();

const db = require('./db')
const query = require('../../listofvalues/queries')

const exportToExcel = async = (data, sheetname, filepath) => {

    headers = _.keys(data[0])

    const workbook = xlsx.utils.book_new()

    const mapData = _.map(data, (v) => { return _.map(headers, (x) => { /* console.log(v[x]); */ return v[x] }) })

    const worksheetdata = [headers, ...mapData]
    let readable = new PassThrough();
    // console.log(mapData)

    const worksheet = xlsx.utils.aoa_to_sheet(worksheetdata)
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetname)
    xlsx.writeFile(workbook, path.resolve(filepath))

    return workbook
}


function createTable(doc, tableData) {
    const tableHeaders = ['Name', 'Age', 'Email'];

    const cellPadding = 10;
    const rowHeight = 20;
    const colWidths = [150, 50, 200];
    const tableTop = doc.y;
    const tableLeft = doc.x;


    doc.rect(tableLeft, tableTop, colWidths.reduce((a, b) => a + b, 0), rowHeight).fill('#CCCCCC');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('red');

    let currentX = tableLeft;
    tableHeaders.forEach((header, index) => {
        doc.text(header, currentX + cellPadding, tableTop + cellPadding);
        currentX += colWidths[index];
    });
    //doc.moveTo(tableLeft, tableTop + 20).lineTo(tableLeft + tableHeaders.length * cellWidth, tableTop + 20).stroke();



    // Draw data rows
    tableData.forEach((row, rowIndex) => {
        const currentY = tableTop + rowHeight + rowIndex * rowHeight;
        doc.rect(tableLeft, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight).fill(rowIndex % 2 === 0 ? '#F2F2F2' : '#FFFFFF');
        doc.font('Helvetica').fontSize(10).fill('black');

        currentX = tableLeft;
        Object.values(row).forEach((cell, columnIndex) => {
            doc.text(cell.toString(), currentX + cellPadding, currentY + cellPadding);
            currentX += colWidths[columnIndex];
        });
    });
}

router.route(`/preview/:params`)
    .get(

        async function get(req, res, next) {

            let responseResult

            //  console.log(query[req.params.params])

            await db.fetchDataDynamic(req.user, req.query, query[req.params.params],
                (error, result) => {
                    if (!_.isEmpty(error)) {
                        responseResult = error;
                    }
                    else {
                        responseResult = result.rows;
                    }
                })


            //            console.log(req.params.params)


            //      const xtc = await exportToExcel(responseResult, req.params.params, filename)


            // console.log('response result', responseResult)

            res.send(responseResult)


        }

    )

router.route(`/:params`)
    .get(

        async function get(req, res, next) {


            res.setHeader('Content-disposition', `attachment; filename=${req.params.params}.pdf`);
            res.setHeader('Content-type', 'application/pdf');

            const data = [
                { name: 'John Doe', age: 30, email: 'johndoe@example.com' },
                { name: 'Jane Smith', age: 25, email: 'janesmith@example.com' },
                { name: 'Bob Johnson', age: 40, email: 'bobjohnson@example.com' },
                // Add more data as needed...
            ];

            const itemsPerPage = 2;
            const totalPages = Math.ceil(data.length / itemsPerPage);

            const doc = new PDFDocument();
            doc.pipe(res);

            const stream = fs.createWriteStream(`${req.params.params}.pdf`);

            doc.pipe(stream);

            header('purchase', 'purchase order', subtitle);


            for (let page = 1; page <= totalPages; page++) {

                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = Math.min(startIndex + itemsPerPage, data.length);

                const tableData = data.slice(startIndex, endIndex);


                createTable(doc, tableData);

                console.log(page, tableData)

                if (!_.isEmpty(tableData))
                    doc.addPage();

            }

            doc.end();


        }

    )

module.exports = router;