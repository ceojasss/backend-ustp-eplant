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
 const { setReportName, initBuildReport, ConstantsObject, ReportHeader, DocumentProperties, Constants } = require('../reporthelper');
 const { mt } = require('date-fns/locale');
 
 
 async function get(req, res, next) {
 
 
     let responseResult, header, detail, title, subtitle
 
 
     //console.log(req.headers.authorization.replaceAll('.', '0').substring(0,255))
 
 
     //DATA
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
 
     // Inisialisasi Report 
     // 1. set File 
     // 2. set document builder
 
     //    console.log(ConstantsObject.PORTRAIT_A4)
 
     const pdfFilename = await setReportName(req, res)
     const doc = await initBuildReport(ConstantsObject.LANDSCAPE_A4)// new jsPDF(PORTRAIT_A4);
     
 
 
     const props = DocumentProperties.LANDSCAPE_A4
 
 
     title = req.query.reportname
     subtitle = req.query.vouchercode
 
     //* PRINT DATA (execute first to get all pages generated)
     await printTable(doc, responseResult)
 
     console.log("Center",doc.internal.pageSize.getWidth())
     //var pageCount = doc.internal.getNumberOfPages();
 
     for (i = 0; i < doc.internal.getNumberOfPages(); i++) {
         doc.setPage(i);
 
         //? WRITE HEADER DOCUMENT
         let mTop = 15
         let baris1 = mTop + 8
         let baris2 = mTop + 8
         let baris3 = mTop + 8
         const AlignTextKiri = props.ALignLeftPosition - 11;
         
         //? Rectangle Frame
         doc.setLineWidth(0.4)
         doc.rect(2.5, 2.5, 292, 205);
         doc.setLineWidth(0.2)
 
         //? WRITE TITLE DOCUMENT
         doc.setFillColor(0, 0, 0);
         doc.rect(AlignTextKiri, 4, 288.5, 7, 'F');
         doc.setFont(Constants.DEFAULT_FONT, "bold");
         doc.setFontSize(Constants.TITLE_FONT_SIZE - 2);
         doc.setTextColor(255, 255, 255); 
         doc.text(`FORMULIR REGISTRASI VENDOR - Badan Usaha PT, CV, UD, PD, Koperasi dll `, AlignTextKiri + 4, mTop - 6, null, null, Constants.LEFT, { charSpace: 1.0 });
         doc.setTextColor(0, 0, 0); 
         doc.setFont(Constants.DEFAULT_FONT, "normal");
         doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);
 
 
         //? Tanggal Pengajuan
         doc.text(`Tanggal Pengajuan `, AlignTextKiri , mTop+1.5, null, null, Constants.LEFT,);
         doc.text(`:`,AlignTextKiri+35 , mTop+1.5, null, null, Constants.LEFT,);
         doc.text(`${responseResult.inputdate || ''}`,AlignTextKiri+48, mTop+1.5);
         doc.rect(AlignTextKiri+40,mTop-2.5,33,6);
 
 
         // ? Jenis Pendaftaran
         doc.setFont(Constants.DEFAULT_FONT, "normal");
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5);
         doc.text("Pendaftaran Vendor Baru", props.ALignLeftPosition+ 95, mTop+0.3);
         doc.rect(props.ALignLeftPosition+90,mTop-3,4,4);
         doc.rect(props.ALignLeftPosition+90,mTop+1.9,4,4);
         doc.text("Pembaharuan / Perubahan Data Vendor Lama", props.ALignLeftPosition+ 95, mTop+5.3);
         
         // ? Vendor Code
         doc.text("Kode Vendor", props.ALignLeftPosition + 190, mTop+2);
         doc.text(":", props.ALignLeftPosition + 215, mTop+2);
         doc.text(`${responseResult.suppliercode||''}`, props.ALignLeftPosition + 225, mTop+2);
         doc.rect(props.ALignLeftPosition + 220,mTop-3.5,22,9)
         doc.setFontSize(Constants.DOC_INFO_FONT_SIZE);
         doc.text("(Diisi oleh Ustp)", props.ALignLeftPosition+ 245, mTop+2);
 
         // -> Label Data Vendor
         doc.rect(AlignTextKiri,22,288.5,61.5);
         doc.setFont(Constants.DEFAULT_FONT, "bold");
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5)
         doc.text("Data Vendor", AlignTextKiri+1, baris1+2);
         doc.setLineWidth(0.3);
         doc.line(AlignTextKiri+1,baris1+2.5,props.ALignLeftPosition+7.7,baris1+2.5)
         doc.text(":", props.ALignLeftPosition+8, baris1+2);
 
         // -> Term Of Payment 
         doc.text("Term Of Payment", props.AlignCenterPosition, baris1+3);
         doc.text(":", props.AlignCenterPosition+36.53416666666667, baris1+3);
         doc.text("Days",props.AlignCenterPosition+48.5, baris1+3);
         doc.setFont(Constants.DEFAULT_FONT, "normal ");
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1)
         doc.rect(props.AlignCenterPosition+38.5, baris1, 3.5, 3.7);
         doc.rect(props.AlignCenterPosition+43.5, baris1, 3.5, 3.7);
 
         // const topdata =responseResult.topcode
         const topdata =responseResult.topcode
 
         const topcodeMap ={
             TOP10: {val:'1',data:'0',x:188,xd:193 ,y:baris1+2.7},
             TOP14: {val:'1',data:'4',x:188,xd:193 ,y:baris1+2.4},
             TOP15: {val:'1',data:'5',x:188,xd:193 ,y:baris1+2.4},
             TOP21: {val:'2',data:'1',x:188,xd:193 ,y:baris1+2.4},
             TOP3:  {val:'3',data:'', x:188,xd:193 ,y:baris1+2.4},
             TOP30: {val:'3',data:'0',x:188,xd:193 ,y:baris1+3},
             TOP45: {val:'4',data:'5',x:188,xd:193 ,y:baris1+2.4},
             TOP60: {val:'6',data:'0',x:188,xd:193 ,y:baris1+2.4},
             TOP7:  {val:'7',data:'', x:188,xd:193 ,y:baris1+2.4},
             TOP90: {val:'9',data:'0',x:188,xd:193 ,y:baris1+2.4},
         }
 
         if (topdata === 'TOP3' || topdata === 'TOP7') {
             const { val, xd, y } = topcodeMap[topdata];
         
             // dfigit Ke 2
             doc.text(val, xd, y);
         } else if (topcodeMap.hasOwnProperty(topdata)) {
             const { val, data, x, xd, y } = topcodeMap[topdata];
         
             //  digit 1
             doc.text(val, x, y);
         
             // digit 2
             doc.text(data, xd, y);
         } else {
             const x = 202;
             const y = baris1 + 5.2; 
             doc.text('', x, y); 
             doc.text('', x + 4, y); 
         }
 
 
         // ? Label Domisili Perusahaan
         doc.setFont(Constants.DEFAULT_FONT, "bold");
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5)
         doc.setLineWidth(0.2);
         doc.text("Domisili Perusahaan", props.AlignCenterPosition, baris1+7);
         doc.text(":",  props.AlignCenterPosition+36.53416666666667, baris1+7);
         doc.line(props.AlignCenterPosition,baris1+7.5,178,baris1+7.5)
        
 
         // ? Left Column Data Vendor
         const labelValueLeftColumn = [
             { label: "Bidang Usaha / Komoditas", value: `${responseResult.kategori} / ${responseResult.subkategori || ''}` },
             { label: "", value: `` },
             { label: "Nama Perusahaan", value: `${responseResult.suppliername || ''}` },
             { label: "Nama Direktur Perusahaan", value: `${responseResult.contactname_dir || ''}` },
             { label: "Nama Penanggung Jawab", value: `${responseResult.contactname_opr || ''}` },
             { label: "Jabatan", value: `${responseResult.contacttitle_opr || ''}` },
             { label: "No. Telepon", value: `${responseResult.phone || '-'}` },
             { label: "No. Handphone", value:  `${responseResult.phone_opr || ''}`  },
         ];
         
         let maxWidthLeftColumn = 0  ;
 
         labelValueLeftColumn.forEach(({label})=>{
             const labelwidth = doc.getStringUnitWidth(label) * Constants.HEADER_FONT_SIZE /doc.internal.scaleFactor;
             if (labelwidth > maxWidthLeftColumn){
                 maxWidthLeftColumn =labelwidth;
             }
         })
 
         const maxWidthL = doc.internal.pageSize.width - 150
 
         function drawLeftColumn (doc,labelValueLeftColumn){
                 let currentLeftY=baris1+6;
                 
                 labelValueLeftColumn.forEach(({label,value})=>{
                     doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5);
                     doc.setFont(Constants.DEFAULT_FONT,"normal");
                     doc.text(label,AlignTextKiri+1,currentLeftY);
                     doc.text(":",maxWidthLeftColumn-2,currentLeftY);
 
                     if (label === "Bidang Usaha / Komoditas"){
                         const maxWidth = doc.internal.pageSize.width - 197; 
                         const parts = doc.splitTextToSize(value, maxWidth);
                         
                         console.log("left",parts[0]);
 
                         doc.text(parts[0],maxWidthLeftColumn,currentLeftY,{maxWidthL});
                         if(parts.length > 1){
                             labelValueLeftColumn.find((item) => item.label === "").value = parts.slice(1).join(" ");
                         }
                     }else {
                         doc.text(value,maxWidthLeftColumn,currentLeftY,{maxWidthL});
                     }
                     doc.setDrawColor(0, 0, 0);
                     doc.setLineWidth(0.25);
                     doc.line(maxWidthLeftColumn, currentLeftY + 1.2, doc.internal.pageSize.width - 150, currentLeftY + 1);
                     currentLeftY+=5
 
                 });
         }
 
         drawLeftColumn(doc,labelValueLeftColumn)
 
             
 
         // ? Right Column Domisili perusahaan
         const labelValueRightColumn = [
         { label: "Alamat Perusahaan",value: `${responseResult.address_sppkp || ''}` },
         { label: "", value: `` },
         { label: "Alamat Pabrik / Workshop", value: `${responseResult.address_ws || ''}` },
         { label: "", value: `` },
         { label: "Alamat Gudang", value: `${responseResult.address_gd || ''}` },
         { label: "", value: `` },
         { label: "Kota", value: `` },
         { label: "Kode Pos", value: `` },
         ];
             
         let maxWidthRightColumn = 0;
         const maxWidth = doc.internal.pageSize.width - 10
             
         labelValueRightColumn.forEach(({ label }) => {
             const labelwidth = doc.getStringUnitWidth(label) * Constants.HEADER_FONT_SIZE / doc.internal.scaleFactor;
             if (labelwidth > maxWidthRightColumn) {
                 maxWidthRightColumn = labelwidth;
                 }
             });
 
             
         function drawRightColumn(doc, labelValueRightColumn) {
                 let currentY = 35;
                 const rightColumnX = props.AlignCenterPosition;
                 
          console.log(rightColumnX+maxWidthRightColumn-2);   
             
         labelValueRightColumn.forEach(({ label, value }, index) => {
             doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);
             doc.setFont(Constants.DEFAULT_FONT, "normal");
             doc.text(label, rightColumnX, currentY);
             doc.text(":", rightColumnX + maxWidthRightColumn - 4, currentY);
             
             if ((label === "Alamat Perusahaan" || label === "Alamat Pabrik / Workshop" || label === "Alamat Gudang") && index !== 1) {
                 const maxWidth = doc.internal.pageSize.width - 197; 
                 const parts = doc.splitTextToSize(value, maxWidth);
                 
                 // console.log('hahaha', parts);
 
 
                 doc.text(parts[0], rightColumnX + maxWidthRightColumn - 2, currentY, { maxWidth });
         
                 if (parts.length > 1) {
                     labelValueRightColumn[index + 1].value = parts.slice(1).join(" ");
                 }
             } else {
                 doc.text(value, rightColumnX + maxWidthRightColumn - 2, currentY, { maxWidth });
             }
             
             doc.setLineWidth(0.3);
             doc.line(rightColumnX + maxWidthRightColumn - 2, currentY + 1.2, doc.internal.pageSize.width - 5.5, currentY + 1.2);
             currentY += 5;
         });
         
         
         }
         
         drawRightColumn(doc, labelValueRightColumn);
             
 
         // ? Label Npwp
         doc.setFont(Constants.DEFAULT_FONT,"bold");
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5);
         doc.text("NPWP", AlignTextKiri+1, mTop+54);
         doc.text(":", props.ALignLeftPosition, mTop+54);
         doc.setLineWidth(0.2);
         doc.line(AlignTextKiri+1,mTop+55,props.ALignLeftPosition-1,mTop+55)
         doc.setFont(Constants.DEFAULT_FONT,"normal");
         doc.text("No NPWP", AlignTextKiri+1, mTop+59);
         doc.text(":", maxWidthLeftColumn-2, mTop+59);
         doc.text("Nama Wajib Pajak", AlignTextKiri+1, mTop+65);
         doc.text(":", maxWidthLeftColumn-2, mTop+65);
 
          // ? Wajib Pajak
          doc.text("Status Wajib Pajak ",props.AlignCenterPosition,mTop+63)
          doc.text(":",props.AlignCenterPosition + maxWidthRightColumn-4, mTop+63);
          doc.rect(props.AlignRightPosition+maxWidthRightColumn-2, mTop+59.7, 4, 4);
          doc.setFontSize(Constants.DOC_INFO_FONT_SIZE+1)
          doc.text("Ya",props.AlignRightPosition+maxWidthRightColumn+3,mTop+63)
          doc.rect(props.AlignRightPosition+maxWidthRightColumn+12, mTop+59.7, 4, 4);
          doc.text("Tidak",props.AlignRightPosition+maxWidthRightColumn+17,mTop+63)
          doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5)
 
          // ? Tanggal
          doc.text("Tanggal :",props.AlignEndPosition+29,mTop+63)
          doc.rect(props.AlignEndPosition+44, mTop+59.7, 4, 4)
          doc.rect(props.AlignEndPosition+48, mTop+59.7, 4, 4)
          doc.rect(props.AlignEndPosition+54, mTop+59.7, 4, 4)
          doc.rect(props.AlignEndPosition+58, mTop+59.7, 4, 4)
          doc.rect(props.AlignEndPosition+64, mTop+59.7, 4, 4)
          doc.rect(props.AlignEndPosition+68, mTop+59.7, 4, 4)
          doc.rect(props.AlignEndPosition+72, mTop+59.7, 4, 4)
          doc.rect(props.AlignEndPosition+76, mTop+59.7, 4, 4)
      
          
         // ? Npwp Number 
         const initialX = maxWidthLeftColumn;
         const initialY = mTop + 56;
         const rectWidth = 4.5;
         const rectHeight = 4.5;
         const lineWidth = 0.2;
 
         doc.setLineWidth(lineWidth);
 
         const dataValues = responseResult.npwp;
 
         for (let i = 0; i < 22; i++) {
             const currentX = initialX + (i * (rectWidth + 0)); 
             doc.rect(currentX, initialY, rectWidth, rectHeight);
         
             if (dataValues && typeof dataValues[i] !== 'undefined' && dataValues[i] !== null) {
                 doc.setFontSize(Constants.HEADER_FONT_SIZE - 1.5);
                 doc.text(dataValues[i].toString(), currentX + 1.5, initialY + 3.5); 
             }
         }
 
         // ? Email Dan Website
         doc.rect(AlignTextKiri,mTop+75,doc.internal.pageSize.width / 1.9,10);
         doc.setFont(Constants.DEFAULT_FONT,"bold");
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5);
         doc.text("Email Address", AlignTextKiri+1, mTop+79);
         doc.text(":", maxWidthLeftColumn-2, mTop+79);
         doc.setFont(Constants.DEFAULT_FONT,"normal");
         doc.text(`${responseResult.email1|| ''}`,maxWidthLeftColumn,mTop+79)
         doc.setFont(Constants.DEFAULT_FONT,"bold");
         doc.text("Url / Website", AlignTextKiri+1, mTop+83);
         doc.text(":", maxWidthLeftColumn-2, mTop+83);
         doc.setFont(Constants.DEFAULT_FONT,"normal");
         doc.text(`${responseResult.website|| ''}`,maxWidthLeftColumn,mTop+83)
         
         // ? Lain Lain
         doc.setFont(Constants.DEFAULT_FONT,"bold");
         doc.rect(AlignTextKiri,+mTop+87,doc.internal.pageSize.width / 1.9,60);
         doc.text("Lain Lain", AlignTextKiri+1, mTop+90);
         doc.text(":",props.ALignLeftPosition+5, mTop+90);
         doc.text("Darimana Anda Mendapatkan Informasi PT.Union Sampoerna Triputra Persada (USTP) Group ?", AlignTextKiri+1, mTop+95);
         doc.line(AlignTextKiri+1,mTop+96,140,mTop+96)
 
 
 
         // ? Info 
         const infodata = responseResult.info;
         // const infodata = null;
         // const infodata = 'E5';
         
         // console.log("Info Data", infodata);
 
         const checkboxMap = {
             E1: { label: "Internet", x: 1, y: 98 },
             E2: { label: "Teman", x: 1, y: 103 },
             E3: { label: "Principle / Pemegang Merk", x: 1, y: 108 },
             E4: { label: "Management PT. USTP", x: 1, y: 113 },
             E5: { label: `Lainya * ${responseResult.info_desc || ''}`, x: 1, y: 118 },
             E6: { label: "*) Jika Lainya Sebutkan", x: 1, y: 123 },
         };
         
         doc.setFont(Constants.DEFAULT_FONT, "normal");
         doc.text(`.........................`,20,mTop+121.5)
         
         for (const key in checkboxMap) {
             const { label, x, y } = checkboxMap[key]
             if (key !== 'E6') {
               doc.rect(AlignTextKiri + x, mTop + y, 4, 4);
               if (infodata !== null && infodata.includes(key)) {
                 doc.setFont("ZapfDingbats");
                 doc.setFontSize(12)
                 doc.text("4", AlignTextKiri + x + 0.5, mTop + y + 3.5);
                 doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5)
                 doc.setFont(Constants.DEFAULT_FONT, "normal");
               }
             }
             doc.text(label, props.ALignLeftPosition - 5, mTop + y + 2.7);
         }
         
         // ? Referensi
         doc.setFont(Constants.DEFAULT_FONT,"bold")
         doc.text("Apakah Anda Memiliki Kenalan di PT. Union Sampoerna Triputra Persada (USTP) Group ?", AlignTextKiri+1,  mTop+130.7);
         doc.line(AlignTextKiri+1,mTop+129+2.7,130, mTop+131.7)
 
  
         const refdata = responseResult.referensi
         const checkBoxRef ={
                 Y: { label: `Ya * ${responseResult.referensi_desc || ''} `, x: 1, y: 133},
                 N: { label: "Tidak", x: 1, y: 138 },
                 L: { label: "*) Jika Ya Sebutkan", x: 1, y: 143 },
         };
         doc.setFont(Constants.DEFAULT_FONT, "normal");
         doc.text(`.........................`,props.ALignLeftPosition , mTop + 137)
         for (const key in checkBoxRef) {
                 const { label, x, y } = checkBoxRef[key];
                 if (key === 'L') {
                 doc.text(label, props.ALignLeftPosition - 5, mTop + y + 2.7);
                 continue;
                 }
                 doc.rect(AlignTextKiri + x, mTop + y, 4, 4);
                 if ( refdata !== null && refdata.includes(key)) {
                 doc.setFont("ZapfDingbats");
                 doc.setFontSize(12)
                 doc.text("4", AlignTextKiri + x + 0.5 , mTop + y + 3.5);
                 doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5)
                 doc.setFont(Constants.DEFAULT_FONT, "normal");
                 }
                 doc.text(label, props.ALignLeftPosition - 5, mTop + y + 2.7);
         };
 
     
         // ? Tanda Tangan Vendor
         doc.setFont(Constants.DEFAULT_FONT,"bold")
         doc.text("Vendor yang bertanda tangan dibawah ini : ", AlignTextKiri+1, 170);
         doc.rect(AlignTextKiri,171.7,doc.internal.pageSize.width / 2.2,20);
         doc.rect(AlignTextKiri,191.7,doc.internal.pageSize.width / 2.2,6);
         doc.text("Nama Perusahaan", AlignTextKiri+1, 195.5);
         doc.text(":", maxWidthLeftColumn-2, 195.5);
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.text(`${responseResult.suppliername ||''}`, maxWidthLeftColumn+2, 195.5);
         doc.rect(AlignTextKiri,197.7,doc.internal.pageSize.width / 2.2,6);
         doc.setFont(Constants.DEFAULT_FONT,"bold")
         doc.text("Nama Direktur", AlignTextKiri+1, 201.5);
         doc.text(":", maxWidthLeftColumn-2, 201.5);
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.text(`${responseResult.contactname_dir||''}`, maxWidthLeftColumn+2, 201.5);
 
 
         // ? Lampiran Legalitas Perusahaan 
         const ALignRightText = props.AlignRightPosition+20
 
         doc.setFont(Constants.DEFAULT_FONT,"bold")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5)
         doc.text("Lampiran Legalitas Perusahaan :",ALignRightText,91)
         doc.line(ALignRightText,92,ALignRightText+45,92)
         doc.text("Ada",ALignRightText+75,91)
         doc.text("Tidak",ALignRightText+91,91)
 
 
         // // ? Dokumen Kelengkapan \\
         const akta_file = responseResult.akta_file
         const nib_file = responseResult.nib_file
         const npwp_file = responseResult.npwp_file
         const sppkp_file =responseResult.sppkp_file
         const ktp_file =responseResult.ktp_dir_file
         const sijk_file = responseResult.sijk_file
         const principle_file =null
         const company_file =null
         const brosur_file =null
         const domisili_file= null
     
 
          //? 1
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5)
         doc.text("1)",ALignRightText,97)
         doc.text("Foto Copy Akte Notaris",ALignRightText+7,97)
         // ? Cb
         doc.rect (ALignRightText+76,94,4.5,4.5)
         doc.rect (ALignRightText+93,94,4.5,4.5)
         // ? Cheklist
         doc.setFont("ZapfDingbats");
         doc.setFontSize(12);
         if ( akta_file !=null) {
             doc.text("4", ALignRightText + 76.7, 97.5);
         } else {
             doc.text("4",ALignRightText+93.7,97.5)
         };
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
 
 
         // ? 2
         doc.text("2)",ALignRightText,103.5)
         doc.text("Foto Copy NIB",ALignRightText+7,103.5)
         // ? CB
         doc.rect (ALignRightText+76,100,4.5,4.5)
         doc.rect (ALignRightText+93,100,4.5,4.5)
         // ? Cheklist
         doc.setFont("ZapfDingbats");
         doc.setFontSize(12);
         if (nib_file != null) {
             doc.text("4", ALignRightText + 76.5, 104);
         } else{
         doc.text("4",ALignRightText+93.5,104);
         }
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
 
 
 
         // ? 3 Data ?
         doc.text("3)",ALignRightText,110)
         doc.text("Foto Copy Domisili Perusahaan",ALignRightText+7,110)
         // ? cb
         doc.rect (ALignRightText+76,107,4.5,4.5)
         doc.rect (ALignRightText+93,107,4.5,4.5)
         // ? checklist
         doc.setFontSize(12);
         // doc.setFont("ZapfDingbats");
         // if (domisili_file != null){
         //     doc.text("4",ALignRightText+76.6,110.5);
         // }else {
         //     doc.text("4",ALignRightText+93.6,110.5);
         // }
         // doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
 
         // // ? 4
         doc.text("4)",ALignRightText,116.7)
         doc.text("Foto Copy NPWP",ALignRightText+7,116.7)
         doc.rect (ALignRightText+76,113.5,4.5,4.5)
         doc.rect (ALignRightText+93,113.5,4.5,4.5)
         doc.setFontSize(12);
         doc.setFont("ZapfDingbats");
         if (npwp_file != null) {
             doc.text("4", ALignRightText + 76.5, 117.2);
         } else{
         doc.text("4",ALignRightText+93.5,117.2);
         }
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
 
 
 
         // ? 5
         doc.text("5)",ALignRightText,123.2)
         doc.text("Foto Copy PKP",ALignRightText+7,123.2)
         doc.rect (ALignRightText+76,120,4.5,4.5)
         doc.rect (ALignRightText+93,120,4.5,4.5)
         doc.setFont("ZapfDingbats");
         doc.setFontSize(12);
         if (sppkp_file != null) {
             doc.text("4", ALignRightText + 76.5, 123.7);
         } else{
         doc.text("4",ALignRightText+93.5,123.7);
         }
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
 
         // ? 6
         doc.text("6)",ALignRightText,129.5)
         doc.text("Foto Copy KTP Direktur Perusahaan",ALignRightText+7,129.5)
         doc.rect (ALignRightText+76,126.2,4.5,4.5)
         doc.rect (ALignRightText+93,126.2,4.5,4.5)
         doc.setFont("ZapfDingbats");
         doc.setFontSize(12);
         if (ktp_file != null) {
             doc.text("4", ALignRightText + 76.5, 130.2);
         } else{
         doc.text("4",ALignRightText+93.5,130.2);
         }
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
     
     
     
         // ? Data ? 7
         doc.text("7)",ALignRightText,136)
         doc.text("Foto Copy Sertifikat Principle / Pemegang Merk",ALignRightText+7,136)
         doc.rect (ALignRightText+76,132.5,4.5,4.5)
         doc.rect (ALignRightText+93,132.5,4.5,4.5)
         doc.setFontSize(12);
         doc.setFont("ZapfDingbats");
         // if ( principle_file != null){
         //     doc.text("4",ALignRightText+76.5,136.5);
         // } else {
         //     doc.text("4",ALignRightText+93.5,136.5);
         // }
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
 
 
         // ? 8 Data?
         doc.text("8)",ALignRightText,142)
         doc.text("Company Profile",ALignRightText+7,142)
         doc.rect (ALignRightText+76,138.5,4.5,4.5)
         doc.rect (ALignRightText+93,138.5,4.5,4.5)
         // doc.setFontSize(12);
         // doc.setFont("ZapfDingbats");
         // if ( company_file !=null){
         //     doc.text("4",ALignRightText+76.5,142.5);
         // } else {
         //     doc.text("4",ALignRightText+93.5,142.5);
         // }
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
 
         // ? 9 Data ?
         doc.text("9)",ALignRightText,148.5)
         doc.text("Brosur",ALignRightText+7,148.5)
         doc.rect (ALignRightText+76,144.5,4.5,4.5)
         doc.rect (ALignRightText+93,144.5,4.5,4.5)
         doc.setFontSize(12);
         doc.setFont("ZapfDingbats");
         // if (brosur_file != null){
         //     doc.text("4",ALignRightText+76.5,148.5);
         // } else {
         //     doc.text("4",ALignRightText+93.5,148.5);
         // }
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
 
         //? 10
         doc.text("10)",ALignRightText,154)
         doc.text("Surat Ijin Usaha Jasa Konstruksi (SIUJK) *",ALignRightText+7,154)
         
         doc.setFontSize(Constants.HEADER_FONT_SIZE-2.5)
         doc.text("* Khusus Kontraktor",ALignRightText+7,158.5)
         doc.rect (ALignRightText+76,150.5,4.5,4.5)
         doc.rect (ALignRightText+93,150.5,4.5,4.5)
         doc.setFontSize(12);
         doc.setFont("ZapfDingbats");
         if (sijk_file !=null){
             doc.text("4",ALignRightText+76.5,154.5);
         }else{
         doc.text("4",ALignRightText+93.5,154.5);
         }
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5); 
         
         // ? 11
         doc.text("11)",ALignRightText,162.5)
         doc.text(" Terkait Perizinan Lainya:",ALignRightText+7,163.5)
         doc.text("-.............................",ALignRightText+7,167)
         doc.rect (ALignRightText+76,161,4.5,4.5)
         doc.rect (ALignRightText+93,161,4.5,4.5)
         doc.text("-.............................",ALignRightText+7,171.5)
         doc.rect (ALignRightText+76,166.5,4.5,4.5)
         doc.rect (ALignRightText+93,166.5,4.5,4.5)
 
     
     
 
         // ? TTD USTP
         doc.setFontSize(Constants.HEADER_FONT_SIZE-1.5)
         doc.setFont(Constants.DEFAULT_FONT,"bold")
         doc.text("Telah Diperiksa oleh PT. Union Sampoerna Triputra Persada:", ALignRightText, 176);
         doc.text("Procurement Department",ALignRightText+7.5,182.5)
         doc.rect(ALignRightText,178,50,7)
         doc.rect(ALignRightText,185,25,15)
         doc.rect(ALignRightText+25,185,25,15)
         doc.rect(ALignRightText,200,25,5)
         doc.rect(ALignRightText+25,200,25,5)
         doc.text("Diajukan oleh",ALignRightText+2.5,203.5)
         doc.text("Proc. Dept Head",ALignRightText+26,203.5)
         doc.rect(ALignRightText+55,178,25,7)
         doc.text("Kode Vendor",ALignRightText+58,182.5)
         doc.setFont(Constants.DEFAULT_FONT,"normal")
         doc.text(`${responseResult.suppliercode}`,ALignRightText+61.5,195)
         doc.rect(ALignRightText+55,185,25,20)
         
     
     }
 
 
 
 
 
     // console.log(responseResult);
 
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
             id: { content: 'Lokasi', colSpan: 2, styles: { halign: 'center' } },
             account: { content: 'Account', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             reference: { content: 'Account Desc', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             cfcode: { content: 'Kode CF', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             remarks: { content: 'Uraian', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
             amount: { content: 'Jumlah', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
         },
         [
             { content: 'Tipe', styles: { halign: 'center' } },
             { content: 'Kode', styles: { halign: 'center' } }
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
         body.push([v.inputdate,v.suppliercode,v.kategori,v.subkategori,v.suppliername,
         v.contactname_dir,v.contactname_opr,v.contacttitle_opr,v.phone,v.phone_opr,v.npwp,v.email1,v.website,
         v.address_ws,v.address_gd,v.info,v.referensi,v.akta_file,v.nib_file,v.npwp_file,v.sppkp_file,
         v.ktp_dir_file,v.info_desc,v.referensi_desc,v.address_sppkp,v.sijk_file,v.topcode
         ])
     })
 /*     for (var j = 1; j <= rowCount; j++) {
         body.push({
             locationtype: 'tipe', locationcode: 'kode', account: 'Account', reference: 'Account Description', cfcode: 'Kode C/F', remarks: 'Uraian', amount: 'jumlah'
         })
     }
  */    return body
 }
 
 
 function printTablex(doc, data) {
     let index = 50
 
     //baris 1
     doc.text(`Voucher Code : ${data.vouchercode}`, 10, 50);
     doc.text(`Currency Code : ${data.currency}`, 150, 50);
 
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
         headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor :[0,0,0] },
         bodyStyles: {
             fillColor: [255, 255, 255]
         }
     })
 
     let finalY = doc.lastAutoTable.finalY || index + 20
 
     doc.autoTable({
         head: headRows(),
         body: bodyRows(data.datadetail),
         startY: finalY + 10,
         theme: 'grid',
         //showHead: 'firstPage',
     })
 
 
 
     /*     doc.autoTable({
             head: headRows(),
             body: data.datadetail,
             startY: finalY + 10,
             theme: 'grid',
             //showHead: 'firstPage',
         })
      */
 
 }
 
 // Function For Print The Table \\
 function printTable(doc, data) {
 
     let index = 20;
     let finalY = doc.lastAutoTable.finalY || index + 20
 
 
     // Styling Table \\
     doc.autoTableSetDefaults({
         headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2 },
         bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2 },
     })
     // Width Column Table \\
     var columnwidth = {
         0: { cellWidth: 10 },
         1: { cellWidth: 30 },
         2: { cellWidth: 75 },
         3: { cellWidth: 20 },
         4: { cellWidth: 20 },
         5: { cellWidth: 0 },
     };
 
 
     doc.autoTable({
         // head: headRows(),
         // body: bodyRows(data.datadetail),
         startY: finalY + 30,
         theme: 'grid',
         //showHead: 'firstPage',
     })
 
 
 
 
 }
 
 module.exports.get = get;