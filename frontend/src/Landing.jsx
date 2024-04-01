import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "./PdfComp";
import "./landing.css";
import { Link } from "react-router-dom";
import { LoginContext, NameContext } from "./App";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function Landing() {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useContext(LoginContext);
  const [userName, setUserName] = useContext(NameContext);
  const fileInputRef = useRef(null); // Reference to the file input element

  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files");
    const latestPdf =
      result.data.data[result.data.data.length - 1]; // Get the last uploaded PDF
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

    // Reset the value of the file input element
    e.target.value = null;
  };

  const handleLogout = () => {
    // Clear the login state
    setIsLoggedIn(false);
    // Clear the pdfFile state
    setPdfFile(null);
  };

  useEffect(() => {
    getPdf(); // Fetch and display the latest PDF on initial load
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      const fetchUserName = async () => {
        try {
          const response = await axios.get("http://localhost:5000/getname", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { name } = response.data;
          console.log(name);
          setUserName(name);
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      };

      fetchUserName();
    }
  }, [setUserName]);

  return (
    <div className="App">
      {/* Navbar */}
      <div className="nav">
        <div className="logo">
          <img
            src="https://www.vidyalai.com/static/svgs/logos/logoLightWithText.svg"
            alt=""
          />
        </div>

        <div className="buttons-users">
          {!isLoggedIn && (
            <>
              <Link className="link" to={"/signup"}>
                <div className="comp">
                  <button>Register</button>
                </div>
              </Link>
              <Link className="link" to={"/login"}>
                <div className="comp">
                  <button>Login</button>
                </div>
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <div className="txt">
                <p>{userName}</p>
              </div>
              <div className="comp">
                <button onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* End of Navbar */}

      <form className="formStyle">
        <h4 className="heading-form">Edit Your Pdf</h4>
        <p className="content-form">
          Customize Your PDF: Edit Each Page According to Your Needs
        </p>
        <div className="buttondiv">
          <button
            className="custom-btn-style"
            onClick={() => fileInputRef.current.click()}
          >
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
          />
        </div>
      </form>

      {/* Render PdfComp only when pdfFile is not null */}
      {pdfFile && <PdfComp pdfFile={pdfFile} />}
    </div>
  );
}

export default Landing;
