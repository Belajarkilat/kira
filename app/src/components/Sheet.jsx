import { useEffect, useRef } from "react";

export default function Sheet({ tajuk, hint, onTutup, children }) {
  const ref = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onTutup();
    }
    document.addEventListener("keydown", onKey);
    const dulu = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = dulu;
    };
  }, [onTutup]);

  return (
    <>
      <div className="scrim" onClick={onTutup} />
      <div className="sheet" ref={ref} role="dialog" aria-modal="true" aria-label={tajuk}>
        <div className="grab" />
        <h3>{tajuk}</h3>
        {hint ? <p className="hint">{hint}</p> : null}
        {children}
      </div>
    </>
  );
}
