export function getNumbers(min: number, max: number): Array<number> {
  let numbers: Array<number> = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }
  return numbers;
}

export function findMinAndMax(
  items: { left: { value: number }; right: { value: number } }[]
): { min: number; max: number } {
  let min, max;
  min = items[0].left.value;
  max = items[0].right.value;
  for (let item of items) {
    if (item.left.value < min) min = item.left.value;
    if (item.right.value < min) min = item.right.value;
    if (item.left.value > max) max = item.left.value;
    if (item.right.value > max) max = item.right.value;
  }
  return { min, max };
}

export function degreesToRadians(degrees:number) : number {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

export let findXPosition = (width:number,radius: number, angle: number) => {
  let angleInRadians = (angle * Math.PI) / 180;
  return width / 2 + radius * Math.cos(angleInRadians);
};