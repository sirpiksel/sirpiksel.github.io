/**
 * Navigates the user to a URL specified in the element's `data-link` attribute.
 * If the element has the class `obfuscated`, the URL is Base64-decoded before redirection.
 *
 * @param {HTMLElement} element - The HTML element containing the `data-link` attribute.
 */
function linkPill(element) {
  const link = element.getAttribute("data-link");
  const obfuscated = element.classList.contains("obfuscated");

  if (!obfuscated) {
    window.location.href = link;
  } else {
    // undo btoa("https://example.com")
    window.location.href = atob(link);
  }
}

/**
 * Initializes slider controls for top, left, right, and bottom positioning.
 * Each slider updates both the numeric output and the corresponding CSS position of associated elements in real-time.
 */
function initSliders() {
  // top
  let slideTop = document.getElementById("top");
  let outTop = document.getElementById("outTop");
  let lineTop = document.getElementsByClassName("top")[0];

  // left
  let slideLeft = document.getElementById("left");
  let outLeft = document.getElementById("outLeft");
  let lineLeft = document.getElementsByClassName("left")[0];

  // right
  let slideRight = document.getElementById("right");
  let outRight = document.getElementById("outRight");
  let lineRight = document.getElementsByClassName("right")[0];

  // bottom
  let slideBottom = document.getElementById("bottom");
  let outBottom = document.getElementById("outBottom");
  let lineBottom = document.getElementsByClassName("bottom")[0];

  outTop.innerHTML = slideTop.value;
  slideTop.oninput = function() {
    outTop.innerHTML = this.value;
    lineTop.style.top = this.value + "px";
  }

  outLeft.innerHTML = slideLeft.value;
  slideLeft.oninput = function() {
    outLeft.innerHTML = this.value;
    lineLeft.style.left = this.value + "px";
  }

  outRight.innerHTML = slideRight.value;
  slideRight.oninput = function() {
    outRight.innerHTML = this.value;
    lineRight.style.right = this.value + "px";
  }

  outBottom.innerHTML = slideBottom.value;
  slideBottom.oninput = function() {
    outBottom.innerHTML = this.value;
    lineBottom.style.bottom = this.value + "px";
  }
}

const oklchColours = [
  null,
  [0.628, 0.2577, 29.23],
  [0.8664, 0.294827, 142.4953],
  [0.452, 0.313214, 264.052],
  [0.968, 0.211, 109.77],
  [0.7017, 0.3225, 328.36],
  [0.9054, 0.15455, 194.7689],
  [1, 0, 0],
  [0.5999, 0, 0],
  [0, 0, 0]
];

function screenTest() {
  let index = 0;
  const html = document.documentElement;
  const container = document.getElementById('screenTest');

  if (!container) {
    console.warn('screenTest(): No element with id "screenTest" found.');
    return;
  }

  html.style.margin = container.style.margin = '0';

  const updateCursor = () => {
    const colour = oklchColours[index];
    const inFullscreen = !!document.fullscreenElement;

    container.style.cursor = (inFullscreen && colour !== null)
      ? 'none'
      : '';
  };

  const setColour = () => {
    const colour = oklchColours[index];

    if (colour === null) {
      container.classList.add('transparent');
    } else {
      container.classList.remove('transparent');
      const [l, c, h] = colour;
      container.style.backgroundColor = `oklch(${l} ${c} ${h})`;
    }

    updateCursor();
  };

  const next = () => {
    index = (index + 1) % oklchColours.length;
    setColour();
  };

  const prev = () => {
    index = (index - 1 + oklchColours.length) % oklchColours.length;
    setColour();
  };

  /* mouse control */
  container.addEventListener('click', () => {
    if (!document.fullscreenElement && html.requestFullscreen) {
      html.requestFullscreen().then(updateCursor).catch(() => {});
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
  });

  /* fullscreen change listener */
  document.addEventListener('fullscreenchange', updateCursor);

  /* keyboard control */
  window.addEventListener('keydown', ev => {
    switch (ev.key) {
      case 'Enter':
      case ' ':
      case 'ArrowRight':
        ev.preventDefault();
        next();
        break;

      case 'ArrowLeft':
        ev.preventDefault();
        prev();
        break;

      case 'f':
      case 'F':
        // Toggle fullscreen with "f"
        if (!document.fullscreenElement && html.requestFullscreen) {
          html.requestFullscreen().then(updateCursor).catch(() => {});
        } else if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
        break;

      case 'Escape':
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
        break;
    }
  });

  container.setAttribute('tabindex', '0');
  container.focus();
  setColour();
}

function screenData() {
  const output = document.getElementById('screenData');

  if (!output) {
    console.warn('screenData(): No element with id "screenData" found.');
    return;
  }

  const updateScreenData = () => {
    const resW = screen.width;
    const resH = screen.height;
    const pixelRatio = window.devicePixelRatio || "unknown";
    const orientation = screen.orientation?.type || "unknown";

    output.innerHTML =
      `Screen Resolution: ${resW} × ${resH}<br>` +
      `Device Pixel Ratio: ${pixelRatio}<br>` +
      `Orientation: ${orientation}`;
  };

  /* init */
  updateScreenData();

  /* update on changes */
  window.addEventListener('resize', updateScreenData);
  window.addEventListener('orientationchange', updateScreenData);

  /* DPI change detection */
  if (window.matchMedia) {
    const dpi = window.devicePixelRatio * 96;
    const mq = window.matchMedia(`(resolution: ${dpi}dpi)`);
    if (mq.addEventListener) {
      mq.addEventListener('change', updateScreenData);
    }
  }
}
