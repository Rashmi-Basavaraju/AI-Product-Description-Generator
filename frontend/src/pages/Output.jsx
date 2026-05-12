import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./style.css";
import { jsPDF } from "jspdf"; // ✅ make sure to install jsPDF

export default function Output() {
  const location = useLocation();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const description =
    location.state?.description || "No description found.";

  // COPY
  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


const handleDownload = () => {
  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("AI Generated Product Description", 20, 20);

  // Line
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  // Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  const splitText = doc.splitTextToSize(description, 170);
  doc.text(splitText, 20, 35);

  // Save
  doc.save("AI_Description.pdf");
};

  return (
    <div className="output-bg">
      <div className="output-wrapper">

        {/* TITLE */}
        <h1 className="output-title">✨ AI Generated Result</h1>
        <p className="output-sub">
          Your product description is ready to use
        </p>

        {/* CARD */}
        <div className="output-card">

          {/* SUCCESS */}
          <div className="success-box">
            ✅ Successfully generated
          </div>

          {/* DESCRIPTION */}
          <div className="output-content">
            {description}
          </div>

          {/* ACTIONS */}
          <div className="output-actions">

            <button className="btn copy" onClick={handleCopy}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
              {copied ? "Copied!" : "Copy"}
            </button>

            <button className="btn download" onClick={handleDownload}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
               Download
            </button>

            <button
              className="btn regen"
              onClick={() => navigate("/dashboard")} >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 4V10H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 20V14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 19C7 21 11 21 14 18L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 5C17 3 13 3 10 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
                  Regenerate
            </button>

            <button
              className="btn dashboard"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}