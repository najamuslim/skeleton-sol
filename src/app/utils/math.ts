export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}

export function mapRange(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
) {
  // Calculate the ratio of the input value within its range
  const ratio = (value - inputMin) / (inputMax - inputMin);
  // Scale the ratio to the output range
  return outputMin + ratio * (outputMax - outputMin);
}
