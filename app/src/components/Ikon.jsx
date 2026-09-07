const s = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

export function Logo({ className = "tly" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path className="bars" d="M11 13v22M19 13v22M27 13v22M35 13v22" />
      <path className="cross" d="M7 36L39 12" />
    </svg>
  );
}

export const Tambah = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Troli = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M3 6h2l2.4 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
    <circle cx="10" cy="20" r="1" />
    <circle cx="17" cy="20" r="1" />
  </svg>
);

export const Panah = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...s} strokeWidth="2">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const Rumah = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
  </svg>
);

export const Orang = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M16 20v-1.5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3V20" />
    <circle cx="10" cy="8" r="3.2" />
    <path d="M17.5 11.5h4M19.5 9.5v4" />
  </svg>
);

export const Beg = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M4 8h16l-1.2 11a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const Carta = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

export const Tong = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
  </svg>
);

export const Padam = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M20 5H9l-5 7 5 7h11a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
    <path d="M15 9.5l-4 5M11 9.5l4 5" />
  </svg>
);

export const Tanda = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

export const Kad = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

export const Gear = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 3v2.2M12 18.8V21M4.6 7.5l1.9 1.1M17.5 15.4l1.9 1.1M4.6 16.5l1.9-1.1M17.5 8.6l1.9-1.1" />
  </svg>
);

export const Pensel = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M4 20h4l10-10-4-4L4 16z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);

export const Muat = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14" />
  </svg>
);

export const Balik = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
