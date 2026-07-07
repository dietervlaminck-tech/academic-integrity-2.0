import { useId, useState, type FormEvent } from "react";
import { useI18n } from "../i18n";

// Capital-letters access-code input. Validation is delegated to onSubmit, which returns
// true when the code opens the gate. The visible field is forced to uppercase so only
// uppercase codes can ever be submitted (codes are checked exactly, case-sensitively).

export type CodeGateProps = {
  /** Returns true if the (uppercased, trimmed) code unlocks the gate. */
  onSubmit: (code: string) => boolean;
  /** Called once, after a successful unlock. */
  onUnlocked?: () => void;
  disabled?: boolean;
};

export function CodeGate({ onSubmit, onUnlocked, disabled = false }: CodeGateProps) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "ok">("idle");
  const inputId = useId();
  const msgId = useId();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (disabled || status === "ok") return;
    const cleaned = value.trim().toUpperCase();
    if (cleaned.length === 0) return;
    const ok = onSubmit(cleaned);
    if (ok) {
      setStatus("ok");
      onUnlocked?.();
    } else {
      setStatus("error");
    }
  }

  const locked = status === "ok";

  return (
    <form className="gate" onSubmit={handleSubmit} noValidate>
      <label htmlFor={inputId} className="room__eyebrow">
        {t.gate.heading}
      </label>
      <div className="gate__row">
        <input
          id={inputId}
          className={`gate__input${status === "error" ? " gate__input--error" : ""}`}
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          aria-label={t.gate.ariaInput}
          aria-describedby={msgId}
          aria-invalid={status === "error"}
          value={value}
          disabled={disabled || locked}
          onChange={(e) => {
            setValue(e.target.value.toUpperCase());
            if (status === "error") setStatus("idle");
          }}
          placeholder={t.gate.placeholder}
        />
        <button
          type="submit"
          className="btn btn--primary"
          disabled={disabled || locked || value.trim().length === 0}
        >
          {t.gate.submit}
        </button>
      </div>
      <p
        id={msgId}
        className={`gate__msg${
          status === "error" ? " gate__msg--error" : status === "ok" ? " gate__msg--ok" : ""
        }`}
        role={status === "error" ? "alert" : "status"}
      >
        {status === "error" ? t.gate.error : status === "ok" ? t.gate.success : t.gate.help}
      </p>
    </form>
  );
}
