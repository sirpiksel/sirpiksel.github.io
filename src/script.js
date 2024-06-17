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

function initUnderscanTool() {
  console.log("Underscan has loaded. Yeet.");
}
