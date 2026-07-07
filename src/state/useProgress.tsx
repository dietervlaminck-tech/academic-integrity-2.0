import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearProgress,
  loadProgress,
  navigateTo,
  resetAll as resetAllState,
  resetRoom as resetRoomState,
  saveProgress,
  setCharter as setCharterState,
  startCourse,
  submitGate,
  type ProgressState,
  type Room,
} from "./progress";

// Thin React layer over the pure progress state machine. Holds the single source of
// truth, persists every change to localStorage, and exposes intent-named actions.

export type ProgressApi = {
  state: ProgressState;
  start: (playerName: string) => void;
  submitCode: (room: Room, code: string) => boolean;
  goTo: (room: Room) => void;
  setCharter: (charter: string) => void;
  resetRoom: (room: Room) => void;
  resetAll: () => void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  const start = useCallback((playerName: string) => {
    setState((s) => startCourse(s, playerName));
  }, []);

  // Returns synchronously whether the code opened the gate, so the CodeGate can render
  // its feedback immediately.
  const submitCode = useCallback((room: Room, code: string): boolean => {
    const result = submitGate(state, room, code);
    if (result.ok) setState(result.state);
    return result.ok;
  }, [state]);

  const goTo = useCallback((room: Room) => {
    setState((s) => (s.current === room ? s : navigateTo(s, room)));
  }, []);

  const setCharter = useCallback((charter: string) => {
    setState((s) => setCharterState(s, charter));
  }, []);

  const resetRoom = useCallback((room: Room) => {
    setState((s) => resetRoomState(s, room));
  }, []);

  const resetAll = useCallback(() => {
    clearProgress();
    setState(resetAllState());
  }, []);

  const api = useMemo<ProgressApi>(
    () => ({ state, start, submitCode, goTo, setCharter, resetRoom, resetAll }),
    [state, start, submitCode, goTo, setCharter, resetRoom, resetAll],
  );

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
