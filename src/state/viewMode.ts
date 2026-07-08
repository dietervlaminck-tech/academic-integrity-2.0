// Persisted choice between the explorable scene and the classic reading view. The scene
// is the default (Dieter, 2026-07-08, after playing the prototype); the reading view
// stays one toggle away in every room as the plain-text fallback, and both views are
// fully keyboard-operable.

export type ViewMode = "reading" | "scene";

export const VIEW_STORAGE_KEY = "ghostwriter.view.v1";

export function loadViewMode(): ViewMode {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    return raw === "reading" ? "reading" : "scene";
  } catch {
    return "scene";
  }
}

export function saveViewMode(mode: ViewMode): void {
  try {
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  } catch {
    // Storage blocked: the toggle still works for the session via React state.
  }
}
