"use client";

import { useEffect, useState } from "react";

// Botón flotante que aparece al bajar y lleva de vuelta al principio de la página.
export default function VolverArriba() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const revisar = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    revisar();
    window.addEventListener("scroll", revisar, { passive: true });
    return () => window.removeEventListener("scroll", revisar);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Volver al inicio"
      title="Volver al inicio"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed z-50 right-4 md:right-8 bottom-[max(1rem,env(safe-area-inset-bottom))] w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-negro bg-mostaza text-negro shadow-[3px_3px_0_0_theme(colors.negro)] flex items-center justify-center hover:bg-amarillo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-negro ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
