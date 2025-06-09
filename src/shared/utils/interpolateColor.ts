/**
 * @param percent Current percent
 * @param freq Amount of deaths
 * @param to Run to
 * @param max The maximum death of deaths on the current Freq
 */
export function interpolateColor(freq: number, max: number) {
  const ratio = freq / max; // 0 — мало смертей, 1 — максимум смертей

  // Зеленый: rgb(50, 200, 50)
  // Красный: rgb(200, 50, 50)
  const red = Math.round(50 + 150 * ratio);
  const green = Math.round(200 - 150 * ratio);
  const blue = 50;

  return `rgb(${red},${green},${blue})`;
}
