const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const { v4: uuidv4 } = require("uuid");
const PdfDetails = require("../PdfDetails");

const uploadFiles = async (req, res) => {
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfDetails.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
};

const generatePdf = async (req, res) => {
  const { pdfFile, checkedPages } = req.body;

  try {
    const existingPdfBytes = fs.readFileSync(`./files/${pdfFile}`);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const newPdfDoc = await PDFDocument.create();
    const copiedPages = [];
    for (let i = 0; i < checkedPages.length; i++) {
      if (checkedPages[i]) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        copiedPages.push(copiedPage);
      }
    }
    for (const page of copiedPages) {
      newPdfDoc.addPage(page);
    }

    const pdfBytes = await newPdfDoc.save();
    const pdfFileName = `generated_${uuidv4()}.pdf`;
    const pdfFilePath = `./generated_pdfs/${pdfFileName}`;
    fs.writeFileSync(pdfFilePath, pdfBytes);

    res.status(200).json({ pdfUrl: pdfFilePath });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
};

const getFiles = async (req, res) => {
  try {
    const data = await PdfDetails.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

module.exports = {
  uploadFiles,
  generatePdf,
  getFiles,
};
