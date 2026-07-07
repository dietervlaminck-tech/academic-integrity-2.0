import type { Room } from "../state/progress";

// Decorative per-room placeholder illustration (see public/assets/README.md). Rendered
// aria-hidden: purely decorative, so screen readers skip it. Base-path safe for GitHub
// Pages via import.meta.env.BASE_URL.

const ART: Partial<Record<Room, string>> = {
  START: "castle.svg",
  LIBRARY: "bookcase.svg",
  MACHINE_ROOM: "machine.svg",
  STUDY: "desk.svg",
  WORKSHOP: "cabinet.svg",
  DOOR: "door.svg",
};

export function RoomIllustration({ room }: { room: Room }) {
  const file = ART[room];
  if (!file) return null;
  const src = `${import.meta.env.BASE_URL}assets/${file}`;
  return (
    <img
      className="room__illustration"
      src={src}
      alt=""
      aria-hidden="true"
      width={240}
      height={160}
      loading="lazy"
    />
  );
}
