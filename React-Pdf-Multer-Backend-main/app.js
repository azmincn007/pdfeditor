const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const { v4: uuidv4 } = require("uuid");

app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("/files", express.static("files"));
app.use("/generated_pdfs", express.static("generated_pdfs"));

const mongoUrl = "mongodb+srv://azminsazz:azmin2000@cluster0.tsyhhu4.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

require("./PdfDetails"); // Import PdfDetails schema

const PdfDetails = mongoose.model("PdfDetails"); // Retrieve PdfDetails model

app.post("/upload-files", upload.single("file"), async (req, res) => {
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfDetails.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.post("/generate-pdf", async (req, res) => {
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
});
app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfDetails.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
