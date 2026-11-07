(// The overview build calls this function with the standalone GEM SVG.
function mountGemOverview(svgSource) {
  const frame = document.querySelector('[data-publication-id="geometric-erasure"] .publication-art');
  if (!frame) return;
  const host = document.createElement("span");
  host.className = "gem-overview-live";
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `<style>svg { display:block; width:100%; height:100%; }</style>${svgSource}`;
  frame.append(host);
  frame.classList.add("has-live-inset");
  const inset = shadow.querySelector(".gd-weight-inset");
  const field = inset.querySelector("[data-field]");
  const circle = inset.querySelector("[data-boundary]");
  const label = inset.querySelector(".gd-atlas-fixed-weight");
  const point = (selector) => {
    const el = inset.querySelector(selector);
    return [Number(el.getAttribute("cx")), Number(el.getAttribute("cy"))];
  };
  const [ax, ay] = point("[data-anchor]");
  const [tx, ty] = point("[data-target]");
  const red = field.getAttribute("fill"), blue = circle.getAttribute("fill");
  const polygon = document.createElementNS(circle.namespaceURI, "polygon");
  const line = document.createElementNS(circle.namespaceURI, "polyline");
  polygon.setAttribute("fill", blue);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", circle.getAttribute("stroke"));
  line.setAttribute("stroke-width", circle.getAttribute("stroke-width"));
  circle.after(polygon, line);

  // At eta = 1 the circle becomes the perpendicular bisector. Clip the
  // anchor-side half-plane to the same 144-unit square as the overview.
  const corners = [[0, 0], [144, 0], [144, 144], [0, 144]];
  const margin = ([x, y]) => 2 * (x * (tx-ax) + y * (ty-ay)) + ax*ax + ay*ay - tx*tx - ty*ty;
  const vertices = [], cuts = [];
  corners.forEach((p, i) => {
    const n = corners[(i+1) % 4], m = margin(p), next = margin(n);
    if (m <= 0) vertices.push(p);
    if ((m <= 0) !== (next <= 0)) {
      const f = m / (m-next);
      const cut = [p[0]+f*(n[0]-p[0]), p[1]+f*(n[1]-p[1])];
      vertices.push(cut); cuts.push(cut);
    }
  });
  polygon.setAttribute("points", vertices.join(" "));
  line.setAttribute("points", cuts.join(" "));

  const stops = [[0,1],[1.7,1],[3.8,1.55],[5,1.55],[8.6,.65],[9.8,.65],[11.8,1],[12.8,1]];
  function paint(seconds) {
    const time = (seconds + 8.6) % 12.8;
    const i = stops.findIndex(([end]) => end > time);
    const [start, from] = stops[i-1], [end, to] = stops[i];
    const t = (time-start)/(end-start);
    const eta = Number((from+(to-from)*t*t*(3-2*t)).toFixed(2));
    field.setAttribute("fill", eta > 1 ? blue : red);
    polygon.style.display = line.style.display = eta === 1 ? "" : "none";
    circle.style.display = eta === 1 ? "none" : "";
    if (eta !== 1) {
      const q = eta*eta, gap = 1-q;
      circle.setAttribute("cx", (ax-q*tx)/gap);
      circle.setAttribute("cy", (ay-q*ty)/gap);
      circle.setAttribute("r", eta*Math.hypot(tx-ax, ty-ay)/Math.abs(gap));
      circle.setAttribute("fill", eta < 1 ? blue : red);
    }
    label.textContent = "η = " + (eta === 1 ? "1" : eta.toFixed(2));
  }

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false, elapsed = 0, start, timer;
  function sync() {
    const now = performance.now();
    if (start !== undefined) elapsed += (now-start)/1000;
    clearInterval(timer);
    start = undefined;
    if (motion.matches) { elapsed = 0; paint(0); }
    else if (visible && !document.hidden) {
      start = now;
      timer = setInterval(() => paint(elapsed+(performance.now()-start)/1000), 50);
    }
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(frame);
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", sync);
  paint(0);
})("<svg class=\"ax-art ax-art-gem\" viewBox=\"0 0 600 330\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"330\" color=\"#a7c9ff\">\n  <style><![CDATA[\ntext{fill:currentColor;font:14px \"Helvetica Neue\",Arial,sans-serif}.gd-weight-inset .gd-atlas-fixed-weight{fill:#fff0e2;paint-order:stroke;stroke:#34445e;stroke-width:2.1px;stroke-opacity:.78;font:italic 18px Georgia,\"Times New Roman\",serif}\n\n@property --gd-ring-progress { syntax:\"<number>\"; inherits:true; initial-value:1; }\n/* Static geometry is present in the SVG itself. Animate only if the browser\n   can express both true Euclidean radii and orient the student arrow. */\n@supports (r:hypot(3px,4px)) and (transform:rotate(atan2(1,2))) {\n  .gd-rings-live .gd-ring-measure,.gd-rings-live .gd-ring-span,.gd-rings-live .gd-ring-student {\n    --rx:calc(var(--ring-sx0) + var(--ring-travel-x)*var(--gd-ring-progress));\n    --ry:calc(var(--ring-sy0) + var(--ring-travel-y)*var(--gd-ring-progress));\n    --dx:calc(var(--rx) - var(--ring-x));\n    --dy:calc(var(--ry) - var(--ring-y));\n  }\n  .gd-rings-live .gd-ring-measure {\n    cx:calc(var(--rx)*1px); cy:calc(var(--ry)*1px);\n    r:calc(hypot(var(--dx),var(--dy))*1px);\n  }\n  .gd-rings-live .gd-ring-span { transform:matrix(var(--dx),var(--dy),0,1,0,0); }\n  .gd-rings-live .gd-ring-student { transform:translate(calc(var(--rx)*1px),calc(var(--ry)*1px)) rotate(atan2(var(--dy),var(--dx))); }\n  @media (prefers-reduced-motion:no-preference) {\n    .gd-rings-live { animation:gd-rings-match 6.6s ease-in-out infinite; }\n  }\n}\n@keyframes gd-rings-match {\n  0%,12%,100% { --gd-ring-progress:0; }\n  55%,77% { --gd-ring-progress:1; }\n}\n  ]]></style>\n  <g class=\"gd-rings-art\" stroke-linejoin=\"round\" stroke-linecap=\"round\">\n    <title>Distance to the anchor and target in front; the effect of the repulsion weight on the zero-loss region behind.</title>\n    <defs>\n      <radialGradient id=\"gd-dr-_R_2aplflb_-aura\">\n        <stop stop-color=\"#8d92be\" stop-opacity=\".20\" />\n        <stop offset=\"1\" stop-color=\"#718bb7\" stop-opacity=\"0\" />\n      </radialGradient>\n      <linearGradient id=\"gd-dr-_R_2aplflb_-paper\" x2=\".94\" y2=\"1\">\n        <stop stop-color=\"#496d9b\" />\n        <stop offset=\".42\" stop-color=\"#334f85\" />\n        <stop offset=\"1\" stop-color=\"#1d3763\" />\n      </linearGradient>\n      <linearGradient id=\"gd-dr-_R_2aplflb_-rim\" x1=\".15\" y1=\"0\" x2=\".85\" y2=\"1\">\n        <stop stop-color=\"#d1e0ef\" />\n        <stop offset=\".31\" stop-color=\"#a1b8d3\" />\n        <stop offset=\"1\" stop-color=\"#6a86aa\" />\n      </linearGradient>\n      <linearGradient id=\"gd-dr-_R_2aplflb_-coral-ink\" x1=\"0\" y1=\".1\" x2=\".9\" y2=\".85\">\n        <stop stop-color=\"#d77571\" />\n        <stop offset=\".4\" stop-color=\"#ffbba5\" />\n        <stop offset=\"1\" stop-color=\"#e6817d\" />\n      </linearGradient>\n      <linearGradient id=\"gd-dr-_R_2aplflb_-azure-ink\" x1=\".1\" y1=\"1\" x2=\".85\" y2=\".1\">\n        <stop stop-color=\"#609fe7\" />\n        <stop offset=\".55\" stop-color=\"#b4e7ff\" />\n        <stop offset=\"1\" stop-color=\"#86bdf8\" />\n      </linearGradient>\n      <pattern id=\"gd-dr-_R_2aplflb_-tooth\" width=\"5.5\" height=\"6.5\" patternUnits=\"userSpaceOnUse\">\n        <circle cx=\"2\" cy=\"2\" r=\".65\" fill=\"#dee5f5\" opacity=\".38\" />\n      </pattern>\n      <clipPath id=\"gd-dr-_R_2aplflb_-trim\">\n        <rect width=\"218\" height=\"218\" rx=\"1\" />\n      </clipPath>\n      <marker id=\"gd-dr-_R_2aplflb_-tip-b\" viewBox=\"0 0 13 12\" refX=\"12\" refY=\"6\" markerUnits=\"userSpaceOnUse\" markerWidth=\"13\" markerHeight=\"12\" orient=\"auto\">\n        <path d=\"M0 .5 12.5 6 0 11.5 2.5 6Z\" fill=\"#92d5ff\" />\n      </marker>\n      <marker id=\"gd-dr-_R_2aplflb_-tip-r\" viewBox=\"0 0 13 12\" refX=\"12\" refY=\"6\" markerUnits=\"userSpaceOnUse\" markerWidth=\"13\" markerHeight=\"12\" orient=\"auto\">\n        <path d=\"M0 .5 12.5 6 0 11.5 2.5 6Z\" fill=\"#ffad96\" />\n      </marker>\n    </defs>\n    <ellipse cx=\"300\" cy=\"161\" rx=\"220\" ry=\"129\" fill=\"url(#gd-dr-_R_2aplflb_-aura)\" />\n    <g transform=\"translate(88 93) rotate(-12) scale(1.27)\">\n      <g class=\"gd-weight-inset\">\n        <defs>\n          <clipPath id=\"gd-weight-inset-_R_16aplflb_-window\">\n            <rect width=\"144\" height=\"144\" />\n          </clipPath>\n          <linearGradient id=\"gd-weight-inset-_R_16aplflb_-blue\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"144\" x2=\"144\" y2=\"0\">\n            <stop stop-color=\"#284977\" />\n            <stop offset=\".48\" stop-color=\"#3a6bb1\" />\n            <stop offset=\"1\" stop-color=\"#638bc8\" />\n          </linearGradient>\n          <linearGradient id=\"gd-weight-inset-_R_16aplflb_-red\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"144\" x2=\"144\" y2=\"0\">\n            <stop stop-color=\"#794c61\" />\n            <stop offset=\".55\" stop-color=\"#ae606b\" />\n            <stop offset=\"1\" stop-color=\"#d58078\" />\n          </linearGradient>\n          <pattern id=\"gd-weight-inset-_R_16aplflb_-grain\" width=\"5\" height=\"5\" patternUnits=\"userSpaceOnUse\">\n            <circle cx=\"1\" cy=\"2\" r=\".6\" fill=\"#fee3d0\" opacity=\".18\" />\n          </pattern>\n        </defs>\n        <g>\n          <g>\n            <path d=\"m-3 1-1 6v140l149 1 3-4-1-142Z\" fill=\"#24364e\" stroke=\"#788da7\" stroke-width=\"1.15\" />\n            <rect x=\"-2\" y=\"-2\" width=\"148\" height=\"148\" fill=\"#455774\" stroke=\"#c6ceda\" stroke-width=\"1\" />\n            <g clip-path=\"url(#gd-weight-inset-_R_16aplflb_-window)\">\n              <rect data-field=\"\" width=\"144\" height=\"144\" fill=\"url(#gd-weight-inset-_R_16aplflb_-red)\" />\n              <circle data-boundary=\"\" cx=\"116.54569283927084\" cy=\"151.85511735970454\" r=\"76.1474055097275\" fill=\"url(#gd-weight-inset-_R_16aplflb_-blue)\" stroke=\"#e8dbe3\" stroke-width=\"1.45\" />\n              <rect width=\"144\" height=\"144\" fill=\"url(#gd-weight-inset-_R_16aplflb_-grain)\" />\n              <path d=\"M7 21V7h14m102 130h14v-14\" fill=\"none\" stroke=\"#f0e7dc\" stroke-opacity=\".6\" stroke-width=\"1.2\" />\n              <circle data-anchor=\"\" cx=\"108.3302752293578\" cy=\"103.04587155963303\" r=\"3.1\" fill=\"#bbdcff\" stroke=\"#2b507f\" stroke-width=\"1\" />\n              <circle data-target=\"\" cx=\"97.10091743119266\" cy=\"36.330275229357795\" r=\"3.1\" fill=\"#ffd1c5\" stroke=\"#95535b\" stroke-width=\"1\" />\n              <text x=\"10\" y=\"132\" class=\"gd-atlas-fixed-weight\">η = 0.65</text>\n            </g>\n          </g>\n        </g>\n      </g>\n    </g>\n    <g transform=\"translate(264 44) rotate(6)\">\n      <rect x=\"2\" y=\"5\" width=\"232\" height=\"232\" rx=\"3\" fill=\"#2b3d5a\" stroke=\"#6d83a4\" stroke-width=\"1.7\" />\n      <rect width=\"232\" height=\"232\" rx=\"3\" fill=\"url(#gd-dr-_R_2aplflb_-rim)\" stroke=\"#d2e0ed\" stroke-width=\"2.2\" />\n      <g transform=\"translate(7 7)\">\n        <g class=\"gd-rings-live\">\n          <g clip-path=\"url(#gd-dr-_R_2aplflb_-trim)\">\n            <rect width=\"218\" height=\"218\" fill=\"url(#gd-dr-_R_2aplflb_-paper)\" />\n            <path d=\"M0 131.7 218 95.0V0H0Z\" fill=\"#9e5b70\" opacity=\".27\" />\n            <rect width=\"218\" height=\"218\" fill=\"url(#gd-dr-_R_2aplflb_-tooth)\" opacity=\".42\" />\n            <g style=\"--ring-x:147;--ring-y:55;--ring-sx0:120;--ring-sy0:76;--ring-travel-x:6;--ring-travel-y:68\">\n              <circle class=\"gd-ring-measure\" cx=\"126\" cy=\"144\" r=\"91.44397191723466\" fill=\"#cc7473\" fill-opacity=\".11\" stroke=\"#1c304b\" stroke-opacity=\".55\" stroke-width=\"5.2\" />\n              <circle class=\"gd-ring-measure\" cx=\"126\" cy=\"144\" r=\"91.44397191723466\" fill=\"none\" stroke=\"url(#gd-dr-_R_2aplflb_-coral-ink)\" stroke-width=\"3.3\" />\n              <g transform=\"translate(147 55)\">\n                <g class=\"gd-ring-span\" transform=\"matrix(-21 89 0 1 0 0)\">\n                  <path d=\"M0 0h1\" fill=\"none\" stroke=\"#ffad96\" stroke-width=\".95\" stroke-dasharray=\"2 3.5\" vector-effect=\"non-scaling-stroke\" />\n                </g>\n              </g>\n            </g>\n            <g style=\"--ring-x:164;--ring-y:156;--ring-sx0:120;--ring-sy0:76;--ring-travel-x:6;--ring-travel-y:68\">\n              <circle class=\"gd-ring-measure\" cx=\"126\" cy=\"144\" r=\"39.84971769034255\" fill=\"#7db9ff\" fill-opacity=\".11\" stroke=\"#1c304b\" stroke-opacity=\".55\" stroke-width=\"5.2\" />\n              <circle class=\"gd-ring-measure\" cx=\"126\" cy=\"144\" r=\"39.84971769034255\" fill=\"none\" stroke=\"url(#gd-dr-_R_2aplflb_-azure-ink)\" stroke-width=\"3.3\" />\n              <g transform=\"translate(164 156)\">\n                <g class=\"gd-ring-span\" transform=\"matrix(-38 -12 0 1 0 0)\">\n                  <path d=\"M0 0h1\" fill=\"none\" stroke=\"#92d5ff\" stroke-width=\".95\" stroke-dasharray=\"2 3.5\" vector-effect=\"non-scaling-stroke\" />\n                </g>\n              </g>\n            </g>\n            <g>\n              <path d=\"M23 171L147 55\" fill=\"none\" stroke=\"#14263e\" stroke-width=\"5.4\" opacity=\".65\" />\n              <path d=\"M23 171L147 55\" fill=\"none\" stroke=\"#ffad96\" stroke-width=\"3.3\" marker-end=\"url(#gd-dr-_R_2aplflb_-tip-r)\" />\n            </g>\n            <g>\n              <path d=\"M23 171L164 156\" fill=\"none\" stroke=\"#14263e\" stroke-width=\"5.4\" opacity=\".65\" />\n              <path d=\"M23 171L164 156\" fill=\"none\" stroke=\"#92d5ff\" stroke-width=\"3.3\" marker-end=\"url(#gd-dr-_R_2aplflb_-tip-b)\" />\n            </g>\n            <g transform=\"translate(23 171)\" style=\"--ring-x:23;--ring-y:171;--ring-sx0:120;--ring-sy0:76;--ring-travel-x:6;--ring-travel-y:68\">\n              <g class=\"gd-ring-span\" transform=\"matrix(103 -27 0 1 0 0)\">\n                <path d=\"M0 0h1\" fill=\"none\" stroke=\"#fff5dc\" stroke-width=\"1.8\" vector-effect=\"non-scaling-stroke\" />\n              </g>\n            </g>\n            <g style=\"--ring-x:23;--ring-y:171;--ring-sx0:120;--ring-sy0:76;--ring-travel-x:6;--ring-travel-y:68\">\n              <g class=\"gd-ring-student\" transform=\"translate(126 144) rotate(-14.688786773318382)\">\n                <path d=\"M0 0-11-4.6-8.7 0-11 4.6Z\" fill=\"#fff5dc\" />\n              </g>\n            </g>\n            <circle cx=\"23\" cy=\"171\" r=\"3.4\" fill=\"#fff5dc\" stroke=\"#33435c\" stroke-width=\"1.2\" />\n            <g stroke-width=\"2.4\" stroke=\"#324059\" paint-order=\"stroke\">\n              <text x=\"150\" y=\"44\" style=\"fill:#ffdbcd;font:15px Arial,sans-serif\">Target</text>\n              <text x=\"152\" y=\"179\" style=\"fill:#c3e4ff;font:15px Arial,sans-serif\">Anchor</text>\n            </g>\n          </g>\n        </g>\n      </g>\n      <path d=\"M7 225V7h218\" fill=\"none\" stroke=\"#30425e\" stroke-width=\"1.2\" />\n    </g>\n  </g>\n</svg>\n");
