const express = require("express");

const connection = require("./config/config");
const cors = require("cors");
const router = require("./routes/testrouter");
const dotenv=require('dotenv');
const app = express();

app.use(express.json());
connection();
app.use(cors());
dotenv.config()
app.use("/files", express.static("files"));
app.use("/generated_pdfs", express.static("generated_pdfs"));

app.use("/", router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
