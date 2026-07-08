// Persisted choice between the classic reading view and the explorable-scene prototype.
// Reading view is the default: it is the accessibility baseline and the didactic
// reference; the scene is an opt-in enhancement.

export type ViewMode = "reading" | "scene";

export const VIEW_STORAGE_KEY = "ghostwriter.view.v1";

export function loadViewMode(): ViewMode {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    return raw === "scene" ? "scene" : "reading";
  } catch {
    return "reading";
  }
}

export function saveViewMode(mode: ViewMode): void {
  try {
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  } catch {
    // Storage blocked: the toggle still works for the session via React state.
  }
}
