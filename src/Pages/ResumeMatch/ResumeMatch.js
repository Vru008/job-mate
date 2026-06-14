import React, { useState } from "react";
import { matchResume } from "../../api/ai";
import "./ResumeMatch.css";

function ScoreRing({ score }) {
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="score-ring" style={{ "--ring": color, "--val": score }}>
      <div className="score-inner">
        <span className="score-num" style={{ color }}>{score}</span>
        <span className="score-label">/ 100</span>
      </div>
    </div>
  );
}

function ResumeMatch() {
  const [mode, setMode] = useState("paste"); // "paste" | "upload"
  const [resume, setResume] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [pdfData, setPdfData] = useState(""); // base64 (no data: prefix)
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handlePdf = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setPdfName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      // strip the "data:application/pdf;base64," prefix
      const base64 = String(reader.result).split(",")[1];
      setPdfData(base64);
    };
    reader.readAsDataURL(file);
  };

  const hasResume = mode === "upload" ? !!pdfData : !!resume.trim();

  const run = async () => {
    if (!hasResume || !job.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload =
        mode === "upload"
          ? { resumePdf: pdfData, job }
          : { resume, job };
      const data = await matchResume(payload);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Could not analyze. Make sure the server is running and your API key is set."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-match">
      <div className="rm-header">
        <h1>Resume ↔ Job Match 🎯</h1>
        <p>
          Paste your resume and a job description to see how well you fit — plus
          exactly what to improve.
        </p>
      </div>

      <div className="rm-inputs">
        <div className="rm-field">
          <div className="rm-label-row">
            <label>Your Resume</label>
            <div className="rm-toggle">
              <button
                className={mode === "paste" ? "active" : ""}
                onClick={() => setMode("paste")}
              >
                Paste
              </button>
              <button
                className={mode === "upload" ? "active" : ""}
                onClick={() => setMode("upload")}
              >
                Upload PDF
              </button>
            </div>
          </div>

          {mode === "paste" ? (
            <textarea
              rows={12}
              placeholder="Paste your resume text here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          ) : (
            <label className="rm-dropzone">
              <input type="file" accept="application/pdf" onChange={handlePdf} hidden />
              <div className="rm-drop-inner">
                <span className="rm-drop-icon">📄</span>
                {pdfName ? (
                  <span className="rm-drop-name">{pdfName}</span>
                ) : (
                  <>
                    <span className="rm-drop-title">Click to upload your resume</span>
                    <span className="rm-drop-sub">PDF only</span>
                  </>
                )}
              </div>
            </label>
          )}
        </div>
        <div className="rm-field">
          <label>Job Description</label>
          <textarea
            rows={12}
            placeholder="Paste the job description here..."
            value={job}
            onChange={(e) => setJob(e.target.value)}
          />
        </div>
      </div>

      <button className="rm-btn" onClick={run} disabled={loading || !hasResume || !job.trim()}>
        {loading ? "Analyzing your match..." : "Check My Match 🎯"}
      </button>

      {error && <p className="rm-error">{error}</p>}

      {result && (
        <div className="rm-result">
          <div className="rm-score-card">
            <ScoreRing score={result.score} />
            <p className="rm-summary">{result.summary}</p>
          </div>

          <div className="rm-cols">
            <div className="rm-col strengths">
              <h3>✅ Strengths</h3>
              <ul>
                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="rm-col gaps">
              <h3>⚠️ Gaps</h3>
              <ul>
                {result.gaps.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="rm-col suggestions">
              <h3>💡 Suggestions</h3>
              <ul>
                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeMatch;
