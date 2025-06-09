/**
 * @param percent Current percent
 * @param freq Amount of deaths
 * @param max The maximum death of deaths on the current Freq
 */
export function interpolateColor(
  percent: number,
  freq: number,
  max: number,
  fromZero: boolean
) {
  // Сглаживание: поднимаем к степени < 1, чтобы распределение стало более равномерным
  const normalizedFreq = Math.pow(freq / max, 0.5); // 0.5 — корень квадратный, можно поэкспериментировать

  const ratio = fromZero
    ? (percent / 5) * normalizedFreq
    : (percent / 20) * normalizedFreq;

  // Ограничим ratio от 0 до 1
  const clamped = Math.min(1, Math.max(0, ratio));

  // Зеленый: rgb(50, 200, 50)
  // Красный: rgb(200, 50, 50)
  const red = Math.round(50 + 150 * clamped);
  const green = Math.round(200 - 150 * clamped);
  const blue = 50;

  return `rgb(${red},${green},${blue})`;
}
