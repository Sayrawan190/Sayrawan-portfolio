import { useRef } from "react";

const MAX_BYTES = 2.5 * 1024 * 1024; // ~2.5MB, keeps the profile row/DB request sane

function fileNameFromUrl(url) {
  if (url.startsWith("data:")) return "CV.pdf";
  try {
    return decodeURIComponent(url.split("/").pop().split("?")[0]) || url;
  } catch {
    return url;
  }
}

export default function PdfInput({ label, value, onChange, hint }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please choose a PDF file.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      alert("That PDF is a bit large. Try one under ~2.5MB, or paste a link to it instead.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="imageInputRow">
        {value ? (
          // Chrome silently blocks a plain click-through navigation to a
          // data: URI (no error, the link just does nothing) — `download`
          // sidesteps that by saving the file instead of navigating to it.
          <a
            className="fileBtn"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            download="Abdullah Al-Serawan CV.pdf"
            style={{ cursor: "pointer" }}
          >
            📄 {fileNameFromUrl(value)}
          </a>
        ) : (
          <span className="fieldHint">No CV uploaded yet</span>
        )}
      </div>
      <div className="imageInputRow">
        <input
          type="text"
          value={value?.startsWith("data:") ? "" : value || ""}
          placeholder="https://... or a file name like cv.pdf"
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: 160 }}
        />
        <label className="fileBtn">
          📤 Upload PDF
          <input ref={fileRef} type="file" accept="application/pdf" onChange={handleFile} />
        </label>
        {value && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => onChange("")}>
            Clear
          </button>
        )}
      </div>
      {hint && <p className="fieldHint">{hint}</p>}
    </div>
  );
}
