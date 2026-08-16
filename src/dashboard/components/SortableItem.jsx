import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// Wraps existing row markup (`.dashRow`, `.categoryBlock`, ...) in a drag
// handle + sortable behavior without needing to touch that markup's own
// internal flex layout — the handle and the (untouched) content sit side by
// side in a plain flex row here instead.
export default function SortableItem({ id, className, dragLabel = "Drag to reorder", children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className={`sortableItem${isDragging ? " is-dragging" : ""}`}>
      <button
        type="button"
        className="sortableItem__handle"
        aria-label={dragLabel}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} aria-hidden="true" />
      </button>
      <div className={className} style={{ flex: "1 1 auto", minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
