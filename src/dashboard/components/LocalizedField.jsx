// Renders two inputs (EN + AR) that together edit a { en, ar } object.
// `as="textarea"` switches both inputs to multi-line.
export default function LocalizedField({ label, value, onChange, as = "input", placeholder }) {
  const safe = value && typeof value === "object" ? value : { en: "", ar: "" };
  const Field = as === "textarea" ? "textarea" : "input";

  return (
    <div className="field">
      <label>{label}</label>
      <div className="formGrid formGrid--single" style={{ gap: 8 }}>
        <div>
          <Field
            type={as === "textarea" ? undefined : "text"}
            value={safe.en}
            placeholder={placeholder ? `${placeholder} (EN)` : "English"}
            onChange={(e) => onChange({ ...safe, en: e.target.value })}
          />
          <span className="langPairLabel">EN</span>
        </div>
        <div>
          <Field
            type={as === "textarea" ? undefined : "text"}
            value={safe.ar}
            placeholder={placeholder ? `${placeholder} (AR)` : "العربية"}
            onChange={(e) => onChange({ ...safe, ar: e.target.value })}
            dir="rtl"
          />
          <span className="langPairLabel">AR</span>
        </div>
      </div>
    </div>
  );
}
