// Small wrapper around localStorage with JSON + error safety.
// Keeping this isolated means swapping to a real backend later only
// requires changing the functions in this one file.

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read "${key}" from localStorage`, err);
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to write "${key}" to localStorage`, err);
    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Failed to remove "${key}" from localStorage`, err);
  }
}
