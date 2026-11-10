// The fixed backdrop: gradient mesh + three drifting orbs + vignette.
// Rendered once, in App, outside the routed content.
export default function Backdrop() {
  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="vignette" aria-hidden="true" />
    </>
  );
}
