const fs = require('fs');
const { jsPDF } = require("jspdf"); // will automatically load the node version
const { constant } = require('lodash');


const Constants = {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
    A4: 'a4',
    DEFAULT_UNITS: 'mm',
    DEFAULT_FONT: 'helvetica',
    TITLE_FONT_SIZE: 16,
    SUBTITLE_FONT_SIZE: 12,
    DOC_INFO_FONT_SIZE: 7,
    HEADER_FONT_SIZE: 10,
    CENTER: "center",
    RIGHT: "right",
    LEFT: "left"
}

const ConstantsObject = {
    PORTRAIT_A4: {
        orientation: Constants.PORTRAIT,
        format: Constants.A4,
        compress: true,
        unit: Constants.DEFAULT_UNITS,
    },
    LANDSCAPE_A4: {
        orientation: Constants.LANDSCAPE,
        format: Constants.A4,
        compress: true,
        unit: Constants.DEFAULT_UNITS,
    }
}

const DocumentProperties = {
    PORTRAIT_A4: {
        MarginTop: 10,
        MarginLeft: 14,
        ALignLeftPosition: 15,
        AlignCenterPosition: 105,
        AlignRightPosition: 160,
        AlignEndPosition: 205,
        MaxWidth: 205
    },
    LANDSCAPE_A4: {
        MarginTop: 10,
        MarginLeft: 14,
        ALignLeftPosition: 15,
        AlignCenterPosition: 148.5, /// Page Size Widht / 2
        AlignRightPosition: 160,
        AlignEndPosition: 205,
        MaxWidth: 205
    },
}

function printdate() {
    const date = new Date()


    return date.toLocaleString('id-ID', { hourCycle: 'h23' })

}

async function ReportHeader(doc, req, props, headerLabel) {

    const date = new Date()

    {/* Company Image */ }
    let imgData = fs.readFileSync('./resources/ustp_kecil.png').toString('base64');
    doc.addImage(imgData, "PNG", props.MarginLeft, 2, 20, 25);

    const totPage = doc.internal.getNumberOfPages()
    const curPage = doc.internal.getCurrentPageInfo().pageNumber
    const h_7 = doc.getLineHeight('print')

    console.log('image height ', doc.getLineHeight(imgData))

    //? SITE SECTION
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.setFontSize(Constants.SUBTITLE_FONT_SIZE);
    doc.text(req.user.sitename, props.ALignLeftPosition, props.MarginTop + 22, null, null, Constants.LEFT);
    let titleHeight = doc.getLineHeight(headerLabel.title) / doc.internal.scaleFactor


    //? SUBTITLE SECTION
    //  doc.setFontSize(Constants.SUBTITLE_FONT_SIZE);
    // doc.text(headerLabel.subtitle, props.AlignCenterPosition, props.MarginTop + titleHeight, null, null, Constants.CENTER);


    //? INFO SECTION
    doc.setFontSize(Constants.DOC_INFO_FONT_SIZE);
    doc.setFont(Constants.DEFAULT_FONT, "bold");
    doc.text(`Print By`, props.AlignRightPosition, props.MarginTop, null, null, Constants.LEFT);
    doc.text(`Print Date`, props.AlignRightPosition, props.MarginTop + (h_7 / doc.internal.scaleFactor), null, null, Constants.LEFT)
    doc.text(`Page`, props.AlignRightPosition, props.MarginTop + ((h_7 / doc.internal.scaleFactor) * 2), null, null, Constants.LEFT);


    doc.setFont(Constants.DEFAULT_FONT, "normal")
    doc.text(`${req.user.loginid}`, props.AlignEndPosition, props.MarginTop, null, null, Constants.RIGHT);
    doc.text(printdate(), props.AlignEndPosition, props.MarginTop + (h_7 / doc.internal.scaleFactor), null, null, Constants.RIGHT);
    doc.text(`${curPage} of ${totPage}`, props.AlignEndPosition, props.MarginTop + ((h_7 / doc.internal.scaleFactor) * 2), null, null, Constants.RIGHT);


};

async function setHeaderRes(res, filename) {

    res.setHeader('Content-disposition', `attachment; filename = ${filename} `);
    res.setHeader('Content-type', 'application/pdf');

    return res
}

async function iconUSTP() {
    return fs.readFileSync('./resources/ustp_small.png').toString('base64');
}

async function setReportName(req, res) {

    let dir = `./output/${req.headers.authorization.replaceAll('.', '0').substring(0, 250)}`
    let fileName = `${req.query.reportname}.pdf`
    console.log('tes', req.query)
    if (!fs.existsSync(dir)) {    //check if folder already exists
        fs.mkdirSync(dir, { recursive: true }, err => console.log('error mkdir', err));    //creating folder
    }


    const reportName = `${dir}/${fileName}`

    //console.log(reportName)

    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/pdf');

    return reportName
}

async function initBuildReport(type) {



    const doc = new jsPDF(type);
    doc.setFont("helvetica", "normal");



    const marginKanan = doc.internal.pageSize.width - 50;
    const font = "helvetica";
    const titleSize = 16;
    const subtitleSize = 14;
    const remarkdocumentSize = 7;
    const headerSize = 8;

    return doc
}


async function stempel(doc, x, y, title, subtitle) {

    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.8 }));
    // cap stempel
    doc.setTextColor("blue")
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text(title, x + 45, y, null, null, "center");

    doc.setDrawColor("blue"); // draw red lines
    doc.setLineWidth(1);
    doc.line(x, y + 2, x + 90, y + 2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(subtitle, x + 45, y + 7, null, null, "center");

    doc.restoreGraphicsState();

}

module.exports = {
    Constants,
    ConstantsObject,
    ReportHeader,
    setHeaderRes,
    setReportName,
    iconUSTP,
    initBuildReport,
    DocumentProperties,
    stempel
}