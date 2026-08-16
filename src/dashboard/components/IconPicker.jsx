import { useEffect, useRef, useState } from "react";
import { SKILL_ICONS, SKILL_ICON_MAP } from "../../utils/skillIcons";

// The field stores either one of SKILL_ICON_MAP's keys (a real icon) or a
// plain emoji character typed into the text field below the grid — this
// renders whichever one `value` currently is, for the trigger button and
// each option in the grid alike.
function IconGlyph({ value, size = 20 }) {
  const Icon = SKILL_ICON_MAP[value];
  if (Icon) return <Icon size={size} aria-hidden="true" />;
  return value || null;
}

export default function IconPicker({ value, onChange, label, emojiLabel = "Or type an emoji" }) {
  const [open, setOpen] = useState(false);
  const [emojiText, setEmojiText] = useState(SKILL_ICON_MAP[value] ? "" : value || "");
  const rootRef = useRef(null);

  useEffect(() => {
    setEmojiText(SKILL_ICON_MAP[value] ? "" : value || "");
  }, [value]);

  useEffect(() => {
    if (!open) return undefined;
    function onDocPointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function pickIcon(key) {
    onChange(key);
    setOpen(false);
  }

  function commitEmoji() {
    const v = emojiText.trim();
    if (v) onChange(v);
  }

  return (
    <div className="iconPicker" ref={rootRef}>
      <button
        type="button"
        className="iconPicker__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label={label}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <IconGlyph value={value} /> {!value && "+"}
      </button>
      {open && (
        <div className="iconPicker__panel">
          <div className="iconPicker__grid" role="listbox" aria-label={label}>
            {SKILL_ICONS.map(([key, Icon]) => (
              <button
                key={key}
                type="button"
                role="option"
                aria-selected={key === value}
                aria-label={key}
                className={`iconPicker__option${key === value ? " is-selected" : ""}`}
                onClick={() => pickIcon(key)}
              >
                <Icon size={18} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="iconPicker__emojiRow">
            <input
              type="text"
              value={emojiText}
              placeholder={emojiLabel}
              onChange={(e) => setEmojiText(e.target.value)}
              onBlur={commitEmoji}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitEmoji();
                  setOpen(false);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
