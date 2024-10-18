type Vector = {
  x: number;
  y: number;
};

export function normalize(v: Vector): Vector {
  const length = Math.sqrt(v.x ** 2 + v.y ** 2);
  return {
    x: v.x / length,
    y: v.y / length,
  };
}

export function add(...a: Vector[]): Vector {
  return a.reduce(
    (acc, v) => {
      acc.x += v.x;
      acc.y += v.y;
      return acc;
    },
    { x: 0, y: 0 },
  );
}
export const sum = add;

export function subtract(a: Vector, b: Vector): Vector {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function multiplyWithScalar(v: Vector, s: number): Vector {
  return {
    x: v.x * s,
    y: v.y * s,
  };
}

export function distance(a: Vector, b: Vector): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
