/* Multi-worm desert vibration field. */
(function () {
  const fieldCanvas = document.querySelector("#spice-canvas");
  const wormCanvas = document.querySelector("#sandworm-canvas");
  const heroPortrait = document.querySelector(".hero-portrait");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fieldCanvas || !wormCanvas || reducedMotion) return;

  const fieldContext = fieldCanvas.getContext("2d", { alpha: true });
  const wormContext = wormCanvas.getContext("2d", { alpha: true });
  const pointer = {
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    active: false,
    lastMovedAt: -10000,
    lastEventAt: 0
  };

  let width = 0;
  let height = 0;
  let density = 25;
  let points = [];
  let worms = [];
  let activeWormIndex = -1;
  let portraitObstacle = null;
  let scrollQuietTimer = 0;
  let lastScrollY = window.scrollY;
  let frame = 0;
  let lastFrame = 0;
  let spiceBlue = "#087fd4";
  let spiceCyan = "#00bde7";
  let wormInk = "#3a2a1e";
  let wormRust = "#a34428";
  let wormSand = "#a77845";
  let wormCore = "#211812";

  function refreshColors() {
    const styles = getComputedStyle(document.documentElement);
    spiceBlue = styles.getPropertyValue("--spice-blue").trim();
    spiceCyan = styles.getPropertyValue("--spice-cyan").trim();
    wormInk = styles.getPropertyValue("--worm-line").trim();
    wormRust = styles.getPropertyValue("--worm-accent").trim();
    wormSand = styles.getPropertyValue("--worm-body").trim();
    wormCore = styles.getPropertyValue("--worm-core").trim();
  }

  function createWorm(relativeX, relativeY, angle, index) {
    const x = width * relativeX;
    const y = height * relativeY;
    const bodyRadius = 11.5 + (index % 3) * 1.8;
    const spacing = bodyRadius * 1.18;
    const length = 18 + (index % 3) * 2;

    return {
      x,
      y,
      vx: Math.cos(angle) * .32,
      vy: Math.sin(angle) * .32,
      phase: index * 1.71 + .5,
      activation: 0,
      bodyRadius,
      spacing,
      trail: Array.from({ length }, (_, segment) => ({
        x: x - Math.cos(angle) * spacing * segment,
        y: y - Math.sin(angle) * spacing * segment
      }))
    };
  }

  function initializeWorms() {
    const starts = width < 720
      ? [
          [.27, .28, .25],
          [.73, .7, 2.9]
        ]
      : [
          [.2, .22, .3],
          [.8, .35, 2.85],
          [.35, .74, -.25]
        ];

    worms = starts.map(([x, y, angle], index) => createWorm(x, y, angle, index));
    activeWormIndex = -1;
  }

  function resizeCanvas(canvas, context, ratio) {
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = innerHeight;
    density = width < 720 ? 31 : 25;
    resizeCanvas(fieldCanvas, fieldContext, ratio);
    resizeCanvas(wormCanvas, wormContext, ratio);
    points = [];

    for (let y = -density; y < height + density; y += density) {
      for (let x = -density; x < width + density; x += density) {
        points.push({
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          depth: .55 + Math.random() * .7,
          size: .4 + Math.random() * .45
        });
      }
    }

    initializeWorms();
    lastScrollY = window.scrollY;
    refreshColors();
    refreshPortraitObstacle();
  }

  function refreshPortraitObstacle() {
    if (!heroPortrait) {
      portraitObstacle = null;
      return;
    }

    const bounds = heroPortrait.getBoundingClientRect();
    const buffer = 42;
    if (bounds.bottom < -buffer || bounds.top > height + buffer) {
      portraitObstacle = null;
      return;
    }

    portraitObstacle = {
      left: bounds.left - buffer,
      right: bounds.right + buffer,
      top: bounds.top - buffer,
      bottom: bounds.bottom + buffer
    };
  }

  function vibrationStrength(time) {
    if (!pointer.active) return 0;
    return Math.max(0, 1 - (time - pointer.lastMovedAt) / 1450);
  }

  function displacedPoint(point, time) {
    const wave = Math.sin(point.x * .008 + point.y * .004 + time * .00055 + point.phase);
    const crossWave = Math.cos(point.x * .003 - point.y * .009 - time * .00032 + point.phase);
    let x = point.x + crossWave * 2.4 * point.depth;
    let y = point.y + wave * 5.5 * point.depth;

    if (pointer.active) {
      const deltaX = x - pointer.x;
      const deltaY = y - pointer.y;
      const distance = Math.hypot(deltaX, deltaY);
      if (distance < 135 && distance > 0) {
        const force = 1 - distance / 135;
        x += (deltaX / distance) * force * 3 - (deltaY / distance) * force * 6;
        y += (deltaY / distance) * force * 3 + (deltaX / distance) * force * 6;
      }
    }

    const cursor = pointer.active
      ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 140)
      : 0;
    const shimmer = (Math.sin(point.x * .014 - point.y * .006 + time * .0011 + point.phase) + 1) / 2;
    return { x, y, cursor, shimmer };
  }

  function drawDuneContours(time) {
    fieldContext.lineWidth = .6;
    fieldContext.strokeStyle = spiceBlue;
    fieldContext.shadowBlur = 0;

    for (let ridge = 0; ridge < 8; ridge += 1) {
      fieldContext.globalAlpha = .025 + ridge * .004;
      fieldContext.beginPath();
      for (let x = -24; x <= width + 24; x += 12) {
        const y = height * (.13 + ridge * .11)
          + Math.sin(x * .006 + time * .00014 + ridge * .8) * (12 + ridge * 1.8)
          + Math.sin(x * .014 - time * .00009 + ridge) * 4;
        if (x === -24) fieldContext.moveTo(x, y);
        else fieldContext.lineTo(x, y);
      }
      fieldContext.stroke();
    }
  }

  function drawField(time) {
    for (const point of points) {
      const moved = displacedPoint(point, time);
      fieldContext.fillStyle = moved.shimmer > .62 ? spiceCyan : spiceBlue;
      fieldContext.globalAlpha = .18 + moved.shimmer * .1 + moved.cursor * .12;
      fieldContext.shadowColor = spiceCyan;
      fieldContext.shadowBlur = moved.cursor > .08 ? moved.cursor * 3 : 0;
      fieldContext.beginPath();
      fieldContext.arc(moved.x, moved.y, point.size + moved.cursor * .22, 0, Math.PI * 2);
      fieldContext.fill();
    }
    fieldContext.shadowBlur = 0;
  }

  function drawVibration(time) {
    const strength = vibrationStrength(time);
    if (!strength) return;

    fieldContext.strokeStyle = spiceCyan;
    fieldContext.lineWidth = .65;
    fieldContext.shadowColor = spiceCyan;
    fieldContext.shadowBlur = 3 * strength;

    for (let ring = 0; ring < 3; ring += 1) {
      const progress = (time * .00072 + ring / 3) % 1;
      const radius = 12 + progress * 66;
      fieldContext.globalAlpha = strength * (1 - progress) * .11;
      fieldContext.beginPath();
      fieldContext.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
      fieldContext.stroke();
    }
    fieldContext.shadowBlur = 0;
  }

  function limitVelocity(worm, maximum) {
    const speed = Math.hypot(worm.vx, worm.vy);
    if (speed <= maximum || speed < .001) return;
    worm.vx = (worm.vx / speed) * maximum;
    worm.vy = (worm.vy / speed) * maximum;
  }

  function moveWormsWithScroll(scrollDelta) {
    const shift = -scrollDelta * .58;
    const padding = 280;
    const wrapDistance = height + padding * 2;

    worms.forEach((worm) => {
      worm.y += shift;
      worm.trail.forEach((segment) => {
        segment.y += shift;
      });

      let wrapOffset = 0;
      while (worm.y < -padding) {
        worm.y += wrapDistance;
        wrapOffset += wrapDistance;
      }
      while (worm.y > height + padding) {
        worm.y -= wrapDistance;
        wrapOffset -= wrapDistance;
      }
      if (wrapOffset !== 0) {
        worm.trail.forEach((segment) => {
          segment.y += wrapOffset;
        });
      }
    });
  }

  function steerAroundPortrait(worm, delta) {
    if (!portraitObstacle) return;

    const lookAhead = 24;
    const probeX = worm.x + worm.vx * lookAhead;
    const probeY = worm.y + worm.vy * lookAhead;
    const nearestX = Math.max(portraitObstacle.left, Math.min(portraitObstacle.right, probeX));
    const nearestY = Math.max(portraitObstacle.top, Math.min(portraitObstacle.bottom, probeY));
    const inside =
      probeX > portraitObstacle.left &&
      probeX < portraitObstacle.right &&
      probeY > portraitObstacle.top &&
      probeY < portraitObstacle.bottom;

    let normalX = probeX - nearestX;
    let normalY = probeY - nearestY;
    let distance = Math.hypot(normalX, normalY);

    if (inside) {
      const edges = [
        { distance: probeX - portraitObstacle.left, x: -1, y: 0 },
        { distance: portraitObstacle.right - probeX, x: 1, y: 0 },
        { distance: probeY - portraitObstacle.top, x: 0, y: -1 },
        { distance: portraitObstacle.bottom - probeY, x: 0, y: 1 }
      ];
      const nearestEdge = edges.reduce((closest, edge) => edge.distance < closest.distance ? edge : closest);
      normalX = nearestEdge.x;
      normalY = nearestEdge.y;
      distance = 0;
    } else if (distance > .001) {
      normalX /= distance;
      normalY /= distance;
    }

    const influenceRadius = 94;
    if (!inside && distance >= influenceRadius) return;

    const proximity = inside ? 1 : 1 - distance / influenceRadius;
    const repulsion = Math.pow(proximity, 2) * (inside ? .24 : .17) * delta;
    const tangentX = -normalY;
    const tangentY = normalX;
    const tangentDirection = worm.vx * tangentX + worm.vy * tangentY >= 0 ? 1 : -1;

    worm.vx += normalX * repulsion + tangentX * tangentDirection * repulsion * .32;
    worm.vy += normalY * repulsion + tangentY * tangentDirection * repulsion * .32;
  }

  function steerWorms(time, delta) {
    const vibration = document.documentElement.dataset.ambience === "quiet"
      ? 0
      : vibrationStrength(time);

    worms.forEach((worm, wormIndex) => {
      const targetActivation = wormIndex === activeWormIndex ? vibration : 0;
      const activationRate = targetActivation > worm.activation ? .028 : .014;
      worm.activation += (targetActivation - worm.activation) * activationRate * delta;

      const heading = Math.atan2(worm.vy, worm.vx);
      const wander = Math.sin(time * .00023 + worm.phase) * .26;
      const idleX = Math.cos(heading + wander) * .2;
      const idleY = Math.sin(heading + wander) * .2;

      const targetX = pointer.x + Math.cos(worm.phase) * 68;
      const targetY = pointer.y + Math.sin(worm.phase) * 48;
      const targetDeltaX = targetX - worm.x;
      const targetDeltaY = targetY - worm.y;
      const targetDistance = Math.max(1, Math.hypot(targetDeltaX, targetDeltaY));
      const arrival = Math.min(1, targetDistance / 165);
      const pursuitSpeed = arrival * (1.35 + worm.activation * .55);
      const pursuitX = (targetDeltaX / targetDistance) * pursuitSpeed;
      const pursuitY = (targetDeltaY / targetDistance) * pursuitSpeed;

      const desiredX = idleX + (pursuitX - idleX) * worm.activation;
      const desiredY = idleY + (pursuitY - idleY) * worm.activation;
      const steering = .01 + worm.activation * .045;
      const maximum = .32 + worm.activation * 1.68;

      worm.vx += (desiredX - worm.vx) * steering * delta;
      worm.vy += (desiredY - worm.vy) * steering * delta;

      worms.forEach((other, otherIndex) => {
        if (wormIndex === otherIndex) return;
        const deltaX = worm.x - other.x;
        const deltaY = worm.y - other.y;
        const distance = Math.max(1, Math.hypot(deltaX, deltaY));
        const separationRadius = 118;
        if (distance < separationRadius) {
          const repulsion = Math.pow(1 - distance / separationRadius, 2) * .1 * delta;
          worm.vx += (deltaX / distance) * repulsion;
          worm.vy += (deltaY / distance) * repulsion;
        }
      });

      steerAroundPortrait(worm, delta);

      const margin = 62;
      if (worm.x < margin) worm.vx += (margin - worm.x) * .003 * delta;
      if (worm.x > width - margin) worm.vx -= (worm.x - width + margin) * .003 * delta;
      if (worm.y < margin) worm.vy += (margin - worm.y) * .003 * delta;
      if (worm.y > height - margin) worm.vy -= (worm.y - height + margin) * .003 * delta;

      limitVelocity(worm, maximum);
      worm.x += worm.vx * delta;
      worm.y += worm.vy * delta;
      worm.trail[0].x = worm.x;
      worm.trail[0].y = worm.y;

      for (let segment = 1; segment < worm.trail.length; segment += 1) {
        const leader = worm.trail[segment - 1];
        const current = worm.trail[segment];
        let deltaX = current.x - leader.x;
        let deltaY = current.y - leader.y;
        let distance = Math.hypot(deltaX, deltaY);
        if (distance < .001) {
          deltaX = -worm.vx;
          deltaY = -worm.vy;
          distance = Math.max(.001, Math.hypot(deltaX, deltaY));
        }
        current.x = leader.x + (deltaX / distance) * worm.spacing;
        current.y = leader.y + (deltaY / distance) * worm.spacing;
      }
    });
  }

  function drawBodyContour(worm) {
    const leftEdge = [];
    const rightEdge = [];

    worm.trail.forEach((segment, index) => {
      const before = worm.trail[Math.max(0, index - 1)];
      const after = worm.trail[Math.min(worm.trail.length - 1, index + 1)];
      const tangentX = after.x - before.x;
      const tangentY = after.y - before.y;
      const tangentLength = Math.max(.001, Math.hypot(tangentX, tangentY));
      const normalX = -tangentY / tangentLength;
      const normalY = tangentX / tangentLength;
      const progress = index / (worm.trail.length - 1);
      const radius = worm.bodyRadius * (1 - progress * .55);

      leftEdge.push({
        x: segment.x + normalX * radius,
        y: segment.y + normalY * radius
      });
      rightEdge.push({
        x: segment.x - normalX * radius,
        y: segment.y - normalY * radius
      });
    });

    wormContext.strokeStyle = wormInk;
    wormContext.globalAlpha = .42;
    wormContext.lineWidth = 1.15;
    wormContext.beginPath();
    wormContext.moveTo(leftEdge[0].x, leftEdge[0].y);
    leftEdge.slice(1).forEach((point) => wormContext.lineTo(point.x, point.y));

    const tail = worm.trail[worm.trail.length - 1];
    wormContext.quadraticCurveTo(
      tail.x,
      tail.y,
      rightEdge[rightEdge.length - 1].x,
      rightEdge[rightEdge.length - 1].y
    );

    for (let index = rightEdge.length - 2; index >= 0; index -= 1) {
      wormContext.lineTo(rightEdge[index].x, rightEdge[index].y);
    }
    wormContext.closePath();
    wormContext.stroke();
  }

  function drawHead(worm, wormIndex, time) {
    const heading = Math.atan2(worm.vy, worm.vx);
    const vibration = wormIndex === activeWormIndex ? worm.activation : 0;
    const radius = worm.bodyRadius * 1.38;

    wormContext.save();
    wormContext.translate(worm.x, worm.y);
    wormContext.rotate(heading);
    wormContext.shadowColor = vibration > 0 ? spiceCyan : wormRust;
    wormContext.shadowBlur = vibration > 0 ? 4 + vibration * 4 : 1.5;

    wormContext.fillStyle = wormCore;
    wormContext.globalAlpha = .68;
    wormContext.beginPath();
    wormContext.arc(0, 0, radius, 0, Math.PI * 2);
    wormContext.fill();

    for (let ring = 1; ring <= 3; ring += 1) {
      wormContext.strokeStyle = ring === 1 && vibration > 0 ? spiceCyan : wormRust;
      wormContext.globalAlpha = .68 - ring * .1;
      wormContext.lineWidth = 1.15;
      wormContext.beginPath();
      wormContext.arc(0, 0, radius * (.22 + ring * .19), 0, Math.PI * 2);
      wormContext.stroke();
    }

    wormContext.strokeStyle = wormSand;
    wormContext.globalAlpha = .58;
    wormContext.lineWidth = .75;
    for (let tooth = 0; tooth < 10; tooth += 1) {
      const angle = tooth * Math.PI * .2;
      wormContext.beginPath();
      wormContext.moveTo(Math.cos(angle) * radius * .34, Math.sin(angle) * radius * .34);
      wormContext.lineTo(Math.cos(angle) * radius * .68, Math.sin(angle) * radius * .68);
      wormContext.stroke();
    }
    wormContext.restore();
    wormContext.shadowBlur = 0;
  }

  function drawWorm(worm, wormIndex, time) {
    wormContext.lineCap = "round";
    wormContext.lineJoin = "round";
    drawBodyContour(worm);
    drawHead(worm, wormIndex, time);
  }

  function render(time) {
    const delta = lastFrame ? Math.min(2.1, (time - lastFrame) / 16.667) : 1;
    lastFrame = time;
    fieldContext.clearRect(0, 0, width, height);
    wormContext.clearRect(0, 0, width, height);
    drawDuneContours(time);
    drawField(time);
    drawVibration(time);
    if (frame % 24 === 0) refreshPortraitObstacle();
    steerWorms(time, delta);
    worms.forEach((worm, index) => drawWorm(worm, index, time));
    fieldContext.globalAlpha = 1;
    wormContext.globalAlpha = 1;
    frame += 1;
    if (frame % 180 === 0) refreshColors();
    requestAnimationFrame(render);
  }

  addEventListener("resize", resize, { passive: true });
  addEventListener("pointermove", (event) => {
    const now = performance.now();
    const wasActive = pointer.active;
    const movementX = wasActive ? event.clientX - pointer.x : 0;
    const movementY = wasActive ? event.clientY - pointer.y : 0;
    const elapsed = Math.max(1, now - pointer.lastEventAt);

    pointer.vx = movementX / elapsed * 16.667;
    pointer.vy = movementY / elapsed * 16.667;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    pointer.lastEventAt = now;

    const speed = Math.hypot(movementX, movementY) / elapsed;
    const wormsResponsive = document.documentElement.dataset.ambience !== "quiet";
    if (wasActive && speed > .42) {
      if (wormsResponsive && (now - pointer.lastMovedAt > 480 || activeWormIndex < 0)) {
        let nearestDistance = Infinity;
        worms.forEach((worm, index) => {
          const distance = Math.hypot(worm.x - pointer.x, worm.y - pointer.y);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            activeWormIndex = index;
          }
        });
      }
      pointer.lastMovedAt = now;
    }
  }, { passive: true });
  addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    moveWormsWithScroll(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;
    refreshPortraitObstacle();
    document.body.classList.add("is-scrolling");
    clearTimeout(scrollQuietTimer);
    scrollQuietTimer = setTimeout(() => {
      document.body.classList.remove("is-scrolling");
    }, 280);
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => {
    pointer.active = false;
    pointer.vx = 0;
    pointer.vy = 0;
  });
  document.addEventListener("ambiencechange", (event) => {
    if (!event.detail?.quiet) return;
    activeWormIndex = -1;
    worms.forEach((worm) => {
      worm.activation = 0;
    });
  });

  resize();
  requestAnimationFrame(render);
})();
