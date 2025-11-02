export default function blendColors(colorA: string, colorB: string, amount: number) {
  const numA = colorA.match(/\w\w/g)
  const numB = colorB.match(/\w\w/g)
  if (!numA || !numB) return '#fff'
  const [rA, gA, bA] = numA.map((c) => parseInt(c, 16));
  const [rB, gB, bB] = numB.map((c) => parseInt(c, 16));

  const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
  const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
  const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');

  return '#' + r + g + b;
}
