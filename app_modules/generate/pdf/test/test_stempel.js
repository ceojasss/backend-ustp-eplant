var doc = new jsPDF();


const stX = 20
const stY = 30


// Empty square
doc.rect(stX, stY, 70, 50);
doc.rect(stX + 70, stY, 70, 50);
doc.setFontSize("14");

doc.text("Dibuat Oleh", stX + 35, stX + 15, null, null, "center");
doc.text("Disetujui Oleh", stX + 105, stX + 15, null, null, "center");

doc.setTextColor("brown")
doc.setFontSize("16");
doc.setFont('', "bold");
doc.text("Signed Digitally\nOn ePlant", 55, 45, null, null, "center");
doc.setFontSize("12");
doc.setFont('', "bold");
doc.text("Date : 17-08-1945 11:12:13", 55, 58, null, null, "center");

doc.setTextColor("brown")
doc.setFontSize("16");
doc.setFont('', "bold");
doc.text("Signed Digitally\nOn ePlant", 125, 45, null, null, "center");
doc.setFontSize("12");
doc.setFont('', "bold");
doc.text("Date : 17-08-1945 15:16:17", 125, 58, null, null, "center");


doc.setLineWidth(0.5);

doc.setTextColor("black")
doc.setFontSize("14");
doc.setFont('helvetica', "normal");
doc.text("Robert Davis", 55, 70, null, null, "center");
doc.line(23, 72, 23 + 64, 72);
doc.text("Chaniago", 125, 70, null, null, "center");

doc.text("Staff Kerani", 55, 78, null, null, "center");
doc.line(93, 72, 93 + 64, 72);
doc.text("General Manager", 125, 78, null, null, "center");

const stlX = 40
const stlY = 38

doc.saveGraphicsState();
doc.setGState(new doc.GState({ opacity: 0.8 }));
// cap stempel
doc.setTextColor("blue")
doc.setFont("times", "bold");
doc.setFontSize(16);
doc.text("PT HARAPAN HIBRIDA KALBAR", stlX + 45, stlY, null, null, "center");

doc.setDrawColor("blue"); // draw red lines
doc.setLineWidth(1);
doc.line(stlX, stlY + 2, stlX + 90, stlY + 2);

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("Sungai Bila Estate", stlX + 45, stlY + 7, null, null, "center");

doc.restoreGraphicsState();
