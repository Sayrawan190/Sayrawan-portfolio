import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

const MAX_BYTES = 1.5 * 1024 * 1024; // ~1.5MB, keeps localStorage/DB rows sane

export default function MultiImageInput({ label, value, onChange, max = 5, hint, addLabel = "Add", uploadLabel = "Upload" }) {
  const fileRef = useRef(null);
  const [urlText, setUrlText] = useState("");
  const images = value || [];
  const full = images.length >= max;

  function addImage(src) {
    if (!src || full) return;
    onChange([...images, src]);
  }

  function removeAt(i) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      alert("That image is a bit large for local storage. Try one under ~1.5MB, or paste an image URL instead.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      addImage(String(reader.result || ""));
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  }

  function handleAddUrl() {
    const v = urlText.trim();
    if (!v) return;
    addImage(v);
    setUrlText("");
  }

  return (
    <div className="field">
      <label>{label} ({images.length}/{max})</label>
      <div className="multiImageGrid">
        {images.map((src, i) => (
          <div className="multiImageGrid__item" key={i}>
            <img className="imagePreview" src={src} alt="" />
            <button type="button" className="multiImageGrid__remove" onClick={() => removeAt(i)} aria-label="Remove image"><X size={11} aria-hidden="true" /></button>
          </div>
        ))}
      </div>
      {!full && (
        <div className="imageInputRow">
          <input
            type="text"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            placeholder="https://... or a file name like project1.jpg"
            style={{ flex: 1, minWidth: 160 }}
          />
          <button type="button" className="btn btn--ghost btn--sm" onClick={handleAddUrl} disabled={!urlText.trim()}>{addLabel}</button>
          <label className="fileBtn">
            <Upload size={14} aria-hidden="true" /> {uploadLabel}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
          </label>
        </div>
      )}
      {hint && <p className="fieldHint">{hint}</p>}
    </div>
  );
}
