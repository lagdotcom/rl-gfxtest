export default function lerp(x: number, y: number, a: number) {
  return (1 - a) * x + a * y;
}
