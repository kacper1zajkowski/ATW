/* Fixed atmosphere behind all content: dither dots, corner glow, drifting
   nebulae (the "black sun" in light), and a vignette. All theme-aware,
   pointer-events:none, reduced-motion safe. See .bg-layers in index.css. */
export function Background() {
  return (
    <div className="bg-layers" aria-hidden="true">
      <div className="dither" />
      <div className="glow" />
      <div className="neb neb-1" />
      <div className="neb neb-2" />
      <div className="vignette" />
    </div>
  );
}
