import { X } from "lucide-react";

export default function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal is-open" role="presentation">
      <div className="modal__backdrop" onClick={onCancel}></div>
      <div className="modal__panel confirmPanel" role="dialog" aria-modal="true">
        <div className="modal__head">
          <h3 className="modal__title">{title}</h3>
          <button className="iconBtn" type="button" onClick={onCancel} aria-label="Close"><X size={16} aria-hidden="true" /></button>
        </div>
        <div className="modal__content">
          <p>{body}</p>
          <div className="modal__actions">
            <button className="btn btn--ghost" type="button" onClick={onCancel}>{cancelLabel}</button>
            <button className="btn btn--danger" type="button" onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
