import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import "./pdfcomp.css"; // Import external CSS file

function PdfComp(props) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [checkedPages, setCheckedPages] = useState([]);
  const [generatedPdf, setGeneratedPdf] = useState(null);
  let absoluteUrl = null; // Define absoluteUrl here

  console.log(generatedPdf);
  if (generatedPdf) {
    const relativeUrl = generatedPdf.substring(1);
    console.log(relativeUrl);
    const baseUrl = 'http://localhost:5000';
    absoluteUrl = baseUrl + relativeUrl; // Assign value to absoluteUrl
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCheckedPages(Array.from({ length: numPages }, () => false));
  };

  const handleCheckboxChange = (index) => {
    const updatedCheckedPages = [...checkedPages];
    updatedCheckedPages[index] = !updatedCheckedPages[index];
    setCheckedPages(updatedCheckedPages);
  };

  const handleEditClick = async () => {
    // Check if any checkbox is selected
    const anyCheckboxSelected = checkedPages.some((isChecked) => isChecked);
  
    // If no checkbox is selected, return early without performing the edit action
    if (!anyCheckboxSelected) {
      alert('Please select at least one page to edit.');
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfFile: props.pdfFile.split("/").pop(),
          checkedPages: checkedPages,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate new PDF");
      }
  
      const { pdfUrl } = await response.json();
      setGeneratedPdf(pdfUrl);
    } catch (error) {
      console.error("Error editing PDF:", error);
    }
  };
  
  const handleDownloadClick = () => {
    // Implement download logic here
    // For example, you can use the 'a' element with the 'download' attribute
    const link = document.createElement('a');
    link.href = absoluteUrl;
    link.setAttribute('download', 'edited_pdf.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pdf-div">
      <p className="pdf-text">
        Page {pageNumber} of {numPages}
      </p>
      {absoluteUrl ? ( // Check if absoluteUrl is not null
        <Document file={absoluteUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }, (_, index) => (
            <div key={index}>
              <Page
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
             
            </div>
          ))}
        </Document>
      ) : (
        <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }, (_, index) => (
            <div key={index}>
              <Page
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              <label className="checkbox-label">
                <input
                  className="checkbox-input"
                  type="checkbox"
                  checked={checkedPages[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
                 Add Page {index + 1} to New Pdf
              </label>
            </div>
          ))}
        </Document>
      )}
      {generatedPdf ? (
        <button onClick={handleDownloadClick} className="download-button">Download PDF</button>
      ) : (
        <button onClick={handleEditClick} className="edit-button">Edit PDF</button>
      )}
    </div>
  );
}

export default PdfComp;
