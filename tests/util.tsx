import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { I18nProvider } from "../src/i18n/I18nProvider";

/** Render a component tree wrapped in the (English-default) i18n provider. */
export function renderWithI18n(ui: ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}
