import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { NarrativeSections } from "../src/components/NarrativeSections";
import type { Section } from "../src/content/rooms";

describe("NarrativeSections list rendering", () => {
  it("renders an <ol> only when ordered is explicitly true, otherwise a <ul>", () => {
    const sections: Section[] = [
      { kind: "list", heading: "Numbered", ordered: true, items: ["a", "b"] },
      { kind: "list", heading: "Plain", ordered: false, items: ["c", "d"] },
      { kind: "list", heading: "Default", items: ["e", "f"] },
    ];
    const { container } = render(<NarrativeSections sections={sections} />);

    const ols = container.querySelectorAll("ol.content-list");
    const uls = container.querySelectorAll("ul.content-list");
    expect(ols).toHaveLength(1);
    // ordered: false and the omitted flag both render unordered.
    expect(uls).toHaveLength(2);
    expect(ols[0]?.textContent).toBe("ab");
  });
});
