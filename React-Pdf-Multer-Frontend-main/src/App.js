import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "./PdfComp";
import './App.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function App() {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const fileInputRef = useRef(null); // Reference to the file input element

  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files");
    const latestPdf = result.data.data[result.data.data.length - 1]; // Get the last uploaded PDF
    setPdfFile(`http://localhost:5000/files/${latestPdf.pdf}`);
  };

  const handleFileChange = async (e) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", e.target.files[0]);

    try {
      const result = await axios.post(
        "http://localhost:5000/upload-files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (result.data.status === "ok") {
        alert("Uploaded Successfully!!!");
        getPdf(); // Fetch and display the latest PDF after successful upload
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  useEffect(() => {
    getPdf(); // Fetch and display the latest PDF on initial load
  }, []);

  return (
    <div className="App">
      

      <form className="formStyle">
        <h4>Edit Your Pdf</h4>
        <br />
        <p>Customize Your PDF: Edit Each Page According to Your Needs</p>
        <div className="buttondiv">     <button className="custom-btn-style" onClick={() => fileInputRef.current.click()}>
  Browse Your Documents
</button>
<input
  id="fileInput"
  ref={fileInputRef}
  type="file"
  accept="application/pdf"
  required
  onChange={handleFileChange}
  style={{ display: "none" }}
/></div>
   

      </form>
    
      <PdfComp pdfFile={pdfFile} />
    </div>
  );
}

export default App;
