export function setViewportToWindowDimension() {
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  return canvas;
}
