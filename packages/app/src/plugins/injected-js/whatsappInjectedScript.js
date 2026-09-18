
//vk: moved from whatsappPreload.js

let snoozed = false;
const originalPlay = Audio.prototype.play;

const shouldBypassSnooze = (audio) => audio.src.startsWith('blob:http');

Audio.prototype.play = function() {
  if (!snoozed || shouldBypassSnooze(this)) {
    return originalPlay.call(this);
  }
  return Promise.resolve();
};

window.bxApi.notificationCenter.addSnoozeDurationInMsChangeListener((_, duration) => {
  snoozed = Boolean(duration);
});

// WhatsApp Web asks for "Segoe UI, Helvetica Neue, Helvetica, ...". On Linux none of these
// exist, and Chromium only accepts fontconfig substitutes that are metric-compatible clones,
// so the whole UI ends up rendered in Nimbus Sans (the Helvetica clone shipped with Ghostscript),
// which hints poorly at small sizes. Point it at the desktop font instead.
const useSystemFontOnLinux = () => {
  if (!/linux/i.test(navigator.platform)) return;

  const style = document.createElement('style');
  style.textContent = `
    body, body *:not(code):not(pre):not([class*="mono"]) {
      font-family: system-ui, -apple-system, "Noto Sans", Cantarell, sans-serif !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
};

useSystemFontOnLinux();
