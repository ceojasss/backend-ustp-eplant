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
//const PDFDocument = require('pdfkit');
const fs = require('fs')
const path = require('path')
const { PassThrough } = require("stream")

const { jsPDF } = require("jspdf"); // will automatically load the node version
require('jspdf-autotable');

const db = require('./db');
const { response } = require('express');
/* 
const exportToExcel = async = (data, sheetname, filepath) => {

    headers = _.keys(data[0])

    const workbook = xlsx.utils.book_new()

    const mapData = _.map(data, (v) => { return _.map(headers, (x) => {* console.log(v[x]);  return v[x] }) })

    const worksheetdata = [headers, ...mapData]
    let readable = new PassThrough();
    // console.log(mapData)

    const worksheet = xlsx.utils.aoa_to_sheet(worksheetdata)
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetname)
    xlsx.writeFile(workbook, path.resolve(filepath))

    return workbook
}
 */

/* function createTable(doc, tableData) {
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
    }); */


async function generateMasterDetailReport(doc, data) {


    _.map(data, (_value, _key) => {
        if (_key !== 'datadetail') {
            doc.font('Helvetica-Bold').fontSize(16).text(`${_key}: ${_value}`, { align: 'left' });
        }
    })

    doc.moveDown();

    // Table headers
    /*   doc.font('Helvetica-Bold').fontSize(12).text('lokasi tipe', { align: 'left', width: 100 });
      doc.font('Helvetica-Bold').fontSize(12).text('lokasi kode', { align: 'left', width: 200 });
      doc.font('Helvetica-Bold').fontSize(12).text('Account', { align: 'left', width: 100 });
      doc.font('Helvetica-Bold').fontSize(12).text('Account Description', { align: 'left', width: 100 });
      doc.font('Helvetica-Bold').fontSize(12).text('Kode C/F', { align: 'left', width: 100 });
      doc.font('Helvetica-Bold').fontSize(12).text('Uraian', { align: 'left', width: 200 });
      doc.font('Helvetica-Bold').fontSize(12).text('Jumlah', { align: 'left', width: 100 });
   */
    doc.text('awwww').text('kiww')
    doc.text('awwww')
    doc.text('awwww')

    /*     doc.font('Helvetica-Bold').fontSize(12).text('Item ID', { align: 'left', width: 100 });
        doc.font('Helvetica-Bold').fontSize(12).text('Item Name', { align: 'left', width: 200 });
        doc.font('Helvetica-Bold').fontSize(12).text('Price', { align: 'left', width: 100 });
     */    // doc.moveDown();

    //    doc.moveDown();


    /*   _.map(data.datadetail, (_value, _key) => {
  
          doc.font('Helvetica').fontSize(12).text(_value['Location Type_1'], { align: 'left', width: 100 });
          doc.font('Helvetica').fontSize(12).text(_value['Location Code_1'], { align: 'left', width: 100 });
          doc.font('Helvetica').fontSize(12).text(_value['Account'], { align: 'left', width: 100 });
          doc.font('Helvetica').fontSize(12).text(_value['reference'], { align: 'left', width: 100 });
          doc.font('Helvetica').fontSize(12).text(_value['Kode C/F'], { align: 'left', width: 100 });
          doc.font('Helvetica').fontSize(12).text(_value['Uraian'], { align: 'left', width: 200 });
          doc.font('Helvetica').fontSize(12).text(_value['Jumlah'], { align: 'left', width: 100 });
  
          doc.moveDown();
      }) */

    doc.end();

}

function headRows() {
    return [
        { id: 'ID', name: 'Name', email: 'Email', city: 'City', expenses: 'Sumur' },
    ]
}

function columns() {
    return [
        { header: 'ID', dataKey: 'id' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'City', dataKey: 'city' },
        { header: 'Exp', dataKey: 'expenses' },
    ]
}
function printTable(doc) {
    // From HTML
    //  doc.autoTable({ html: '.table' })

    // From Javascript
    var finalY = doc.lastAutoTable.finalY || 10
    doc.text('From javascript arrays', 14, finalY + 15)

    /*     doc.autoTable({
            startY: finalY + 20,
            head: [
                [
                    {
                        content: 'People',
                        colSpan: 5,
                        styles: { halign: 'center', fillColor: [22, 160, 133] },
                    },
                ],
                ['ID', 'Name', 'Email', 'Country', 'IP-address']
            ],
            body: [
                ['1', 'Donna', 'dmoore0@furl.net', 'China', '211.56.242.221'],
                ['2', 'Janice', 'jhenry1@theatlantic.com', 'Ukraine', '38.36.7.199'],
                [
                    '3',
                    'Ruth',
                    'rwells2@constantcontact.com',
                    'Trinidad and Tobago',
                    '19.162.133.184',
                ],
                ['4', 'Jason', 'jray3@psu.edu', 'Brazil', '10.68.11.42'],
                ['5', 'Jane', 'jstephens4@go.com', 'United States', '47.32.129.71'],
                ['6', 'Adam', 'anichols5@com.com', 'Canada', '18.186.38.37'],
            ],
        })
     */
    /*     doc.autoTable(doc, {
            columnStyles: { europe: { halign: 'center' } }, // European countries centered
            body: [
                { europe: 'Sweden', america: 'Canada', asia: 'China' },
                { europe: 'Norway', america: 'Mexico', asia: 'Japan' },
            ],
            columns: [
                { header: 'Europe', dataKey: 'europe' },
                { header: 'Asia', dataKey: 'asia' },
            ],
        }) */

    doc.autoTable({
        head: headRows(),
        body: bodyRows(50),
        startY: 50,
        showHead: 'firstPage',
    })


    //   return doc
}

async function get(req, res, next) {

    let pdfFilename = "da.pdf"

    const doc = new jsPDF()
    // Create a new PDF document
    /*  
     doc.autoTable({
         head: [['ID', 'Name', 'Email', 'Country', 'IP-address']],
         body: [
             ['1', 'HelloäöüßÄÖÜ', 'dmoore0@furl.net', 'China', '211.56.242.221'],
             ['2', 'Janice', 'jhenry1@theatlantic.com', 'Ukraine', '38.36.7.199'],
             ['3', 'Ruth', 'rwells2@example.com', 'Trinidad', '19.162.133.184'],
             ['4', 'Jason', 'jray3@psu.edu', 'Brazil', '10.68.11.42'],
             ['5', 'Jane', 'jstephens4@go.com', 'United States', '47.32.129.71'],
             ['6', 'Adam', 'anichols5@com.com', 'Canada', '18.186.38.37'],
         ],
     }) */

    printTable(doc)
    doc.save(pdfFilename)

    res.setHeader('Content-Disposition', `attachment; filename=${pdfFilename}`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(pdfFilename, { root: '.' }, (err) => {
        if (err) {
            console.log('Error sending PDF:', err);
            res.status(500).send('Error generating PDF');
        } else {
            console.log('PDF sent successfully');
        }
    });
}

module.exports.get = get;

function bodyRows(rowCount) {
    rowCount = rowCount || 10
    var body = []
    for (var j = 1; j <= rowCount; j++) {
        body.push({
            id: j,
            name: 'tuyul',
            email: 'tuyul',
            city: 'tuyul',
            expenses: 'tuyul',
        })
    }
    return body
}