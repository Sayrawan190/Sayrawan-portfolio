import { useRef } from "react";
import { Upload } from "lucide-react";

const MAX_BYTES = 1.5 * 1024 * 1024; // ~1.5MB, keeps localStorage usage sane

export default function ImageInput({ label, value, onChange, hint }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      alert("That image is a bit large for local storage. Try one under ~1.5MB, or paste an image URL instead.");
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
          <img className="imagePreview" src={value} alt="" />
        ) : (
          <div className="imagePreview" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>—</div>
        )}
        <input
          type="text"
          value={value?.startsWith("data:") ? "" : value || ""}
          placeholder="https://... or a file name like myPhoto.jpg"
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: 160 }}
        />
        <label className="fileBtn">
          <Upload size={14} aria-hidden="true" /> Upload
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
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
