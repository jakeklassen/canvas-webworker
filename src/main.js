const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector('#game')
);
const buffer = canvas.transferControlToOffscreen();

const worker = new Worker('src/loop.js', {
  type: 'module',
});

const urlParts = location.href.split('/');
if (urlParts[urlParts.length - 1].indexOf('.') !== -1) {
  urlParts.pop();
}

worker.postMessage({ event: 'start', buffer }, [buffer]);
