export const mod = (n, m) => ((n % m) + m) % m;

export const hue = (h, s = 1, l = 0.5) => {

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const hp = h / 60;
	const x = c * (1 - Math.abs(hp % 2 - 1));

	let r = 0, g = 0, b = 0;

	if (0 <= hp && hp < 1) [r, g, b] = [c, x, 0];
	else if (1 <= hp && hp < 2) [r, g, b] = [x, c, 0];
	else if (2 <= hp && hp < 3) [r, g, b] = [0, c, x];
	else if (3 <= hp && hp < 4) [r, g, b] = [0, x, c];
	else if (4 <= hp && hp < 5) [r, g, b] = [x, 0, c];
	else if (5 <= hp && hp < 6) [r, g, b] = [c, 0, x];

	const m = l - c / 2;
	return [
		Math.round((r + m) * 255),
		Math.round((g + m) * 255),
		Math.round((b + m) * 255)
	];
	
}

export function triangleWave(t) {
  return 1 - 2 * Math.abs((t % 1) - 0.5);
}

export const lerp = (a, b, t) => {
	return a + (b - a) * t;
}

