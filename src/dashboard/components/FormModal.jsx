export default function FormModal({ open, title, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div className="modal is-open" role="presentation">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        style={wide ? { width: "min(720px, calc(100% - 26px))" } : undefined}
      >
        <div className="modal__head">
          <h3 className="modal__title">{title}</h3>
          <button className="iconBtn" type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
}
