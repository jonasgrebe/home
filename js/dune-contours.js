(() => {
  const canvas = document.querySelector("#dune-contour-canvas");
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;

  const contourLevels = Array.from({ length: 16 }, (_, index) => -1.32 + index * 0.18);
  const edgePairs = {
    1: [[3, 0]],
    2: [[0, 1]],
    3: [[3, 1]],
    4: [[1, 2]],
    6: [[0, 2]],
    7: [[3, 2]],
    8: [[2, 3]],
    9: [[2, 0]],
    11: [[2, 1]],
    12: [[1, 3]],
    13: [[1, 0]],
    14: [[0, 3]],
  };

  let frame = 0;

  function terrainHeight(x, y) {
    const warpedX = x + 132 * Math.sin(y / 610) + 38 * Math.sin(y / 173);
    const warpedY = y + 94 * Math.sin(x / 470) - 31 * Math.cos(x / 187);
    const along = (warpedX + warpedY * 0.14) / 248;
    const across = (warpedY - warpedX * 0.09) / 346;

    return (
      0.7 * Math.sin(along) +
      0.5 * Math.sin(across + 0.72 * Math.sin(along * 0.57)) +
      0.27 * Math.cos(along * 1.76 - across * 0.52) +
      0.16 * Math.sin(across * 2.25 + along * 0.31)
    );
  }

  function interpolate(a, b, level) {
    const span = b - a;
    if (Math.abs(span) < 0.0001) return 0.5;
    return Math.max(0, Math.min(1, (level - a) / span));
  }

  function edgePoint(edge, x, y, size, values, level) {
    const [topLeft, topRight, bottomRight, bottomLeft] = values;

    if (edge === 0) {
      return [x + interpolate(topLeft, topRight, level) * size, y];
    }
    if (edge === 1) {
      return [x + size, y + interpolate(topRight, bottomRight, level) * size];
    }
    if (edge === 2) {
      return [x + interpolate(bottomLeft, bottomRight, level) * size, y + size];
    }
    return [x, y + interpolate(topLeft, bottomLeft, level) * size];
  }

  function getPairs(caseIndex, values, level) {
    if (caseIndex !== 5 && caseIndex !== 10) return edgePairs[caseIndex] || [];

    const center = values.reduce((sum, value) => sum + value, 0) / values.length;
    if (caseIndex === 5) {
      return center > level ? [[0, 1], [2, 3]] : [[3, 0], [1, 2]];
    }
    return center > level ? [[3, 0], [1, 2]] : [[0, 1], [2, 3]];
  }

  function drawContours() {
    frame = 0;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const cellSize = width < 720 ? 22 : 26;
    const scrollOffset = window.scrollY || document.documentElement.scrollTop || 0;
    const firstWorldY = Math.floor(scrollOffset / cellSize) * cellSize;
    const screenTop = firstWorldY - scrollOffset - cellSize;
    const columns = Math.ceil(width / cellSize) + 1;
    const rows = Math.ceil((height - screenTop) / cellSize) + 1;

    const renderWidth = Math.round(width * pixelRatio);
    const renderHeight = Math.round(height * pixelRatio);
    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
      canvas.width = renderWidth;
      canvas.height = renderHeight;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--rust").trim();

    const samples = Array.from({ length: rows }, (_, row) => {
      const worldY = firstWorldY - cellSize + row * cellSize;
      return Array.from({ length: columns }, (_, column) => terrainHeight(column * cellSize, worldY));
    });

    contourLevels.forEach((level, levelIndex) => {
      const majorContour = levelIndex % 4 === 2;
      context.beginPath();
      context.globalAlpha = majorContour ? 0.64 : 0.43;
      context.lineWidth = majorContour ? 1.15 : 0.8;

      for (let row = 0; row < rows - 1; row += 1) {
        const y = screenTop + row * cellSize;
        for (let column = 0; column < columns - 1; column += 1) {
          const x = column * cellSize;
          const values = [
            samples[row][column],
            samples[row][column + 1],
            samples[row + 1][column + 1],
            samples[row + 1][column],
          ];
          const caseIndex =
            (values[0] >= level ? 1 : 0) |
            (values[1] >= level ? 2 : 0) |
            (values[2] >= level ? 4 : 0) |
            (values[3] >= level ? 8 : 0);

          getPairs(caseIndex, values, level).forEach(([startEdge, endEdge]) => {
            const [startX, startY] = edgePoint(startEdge, x, y, cellSize, values, level);
            const [endX, endY] = edgePoint(endEdge, x, y, cellSize, values, level);
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
          });
        }
      }

      context.stroke();
    });

    context.globalAlpha = 1;
  }

  function scheduleDraw() {
    if (frame) return;
    frame = requestAnimationFrame(drawContours);
  }

  addEventListener("scroll", scheduleDraw, { passive: true });
  addEventListener("resize", scheduleDraw, { passive: true });
  new MutationObserver(scheduleDraw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  scheduleDraw();
})();
