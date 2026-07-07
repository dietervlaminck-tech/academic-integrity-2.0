import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "../src/App";
import { I18nProvider } from "../src/i18n/I18nProvider";
import { ProgressProvider } from "../src/state/useProgress";
import { completionCode, STORAGE_KEY } from "../src/state/progress";
import { en } from "../src/i18n/en";
import { fmt } from "../src/i18n";

function seedEscaped(playerName: string, charter: string, doorIso: string) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      furthest: "ESCAPED",
      current: "ESCAPED",
      clearedAt: { DOOR: doorIso },
      playerName,
      charter,
    }),
  );
}

function renderApp() {
  return render(
    <I18nProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </I18nProvider>,
  );
}

describe("CertificateScreen", () => {
  it("shows the deterministic completion code, the name and the charter", () => {
    seedEscaped("Ada", "I will verify every AI-assisted claim.", "2026-07-07T10:00:00.000Z");
    renderApp();

    expect(
      screen.getByRole("heading", { level: 1, name: en.certificate.title }),
    ).toBeInTheDocument();

    const expectedCode = completionCode("Ada", "2026-07-07");
    expect(expectedCode).toMatch(/^NYC-\d{4}$/);
    expect(screen.getByText(expectedCode)).toBeInTheDocument();

    expect(screen.getByText(fmt(en.certificate.body, { name: "Ada" }))).toBeInTheDocument();
    expect(screen.getByText("I will verify every AI-assisted claim.")).toBeInTheDocument();
  });

  it("falls back to an anonymous name when none was given", () => {
    seedEscaped("", "", "2026-07-07T10:00:00.000Z");
    renderApp();
    expect(
      screen.getByText(fmt(en.certificate.body, { name: en.certificate.anonymous })),
    ).toBeInTheDocument();
  });
});
