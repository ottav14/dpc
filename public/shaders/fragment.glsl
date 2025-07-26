#define ITERATIONS 100
#define G 1.0

precision mediump float;

uniform vec2 uResolution;

/*
vec3 hue(float h) {
	h = fract(h) * 6.0;
	float c = 1.0;
	float x = c * (1.0 - abs(mod(h, 2.0) - 1.0));

	if(h < 1.0) return vec3(c, x, 0.0);
	if(h < 2.0) return vec3(x, c, 0.0);
	if(h < 3.0) return vec3(0.0, c, x);
	if(h < 4.0) return vec3(0.0, x, c);
	if(h < 5.0) return vec3(x, 0.0, c);
	return vec3(c, 0.0, x);
}


vec2 mandelbrot(vec2 p) {
	vec2 c = vec2(p.x, p.y);
	vec2 z = vec2(p.x, p.y);
	float minDist = 1000.0;
	for(int i=0; i<ITERATIONS; i++) {
		float a = z.x * z.x - z.y * z.y + c.x;
		float b = 2.0 * z.x * z.y + c.y; 
		z = vec2(a, b);

		float dist = length(z);
		if(dist < minDist)
			minDist = dist;

		if(dist > 2.0)
			return vec2(minDist, float(i));
	}
	return vec2(minDist, float(ITERATIONS));
}

vec2 dpFractal(vec2 p) {

	float t0 = 1.57;
	float t1 = 0.0;
	float m0 = 10.0;
	float m1 = 10.0;
	float v0 = 0.0;
	float v1 = 0.0;
	float l0 = 50.0;
	float l1 = 50.0;
	float minDist = 1000.0;

	for(int i=0; i<ITERATIONS; i++) {

		float term1a = G * (2.0 * m0 + m1) * sin(t0);
		float term1b = -m1 * G * sin(t0 - 2.0 * t1);
		float term1c = -2.0 * sin(t0 - t1) * m1;
		float term1d = v1 * v1 * l1 + v0 * v0 * l0 * cos(t0 - t1);
		float term1e = l0 * (2.0 * m0 + m1 - m1 * cos(2.0 * t0 - 2.0 * t1));

		float term2a = 2.0 * sin(t0 - t1);
		float term2b = v0 * v1 * l0 * (m0 + m1);
		float term2c = G * (m0 + m1) * cos(t0);
		float term2d = v1 * v1 * l1 * m1 * cos(t0 - t1);
		float term2e = l1 * (2.0 * m0 + m1 - m1 * cos(2.0 * t0 - 2.0 * t1));

		v0 += (term1a + term1b + term1c * term1d) / term1e;
		v1 += term2a * (term2b + term2c + term2d) / term2e;

		t0 += v0;
		t1 += v1;

		float dist = length(vec2(v0, v1));
		if(dist < minDist)
			minDist = dist;

		if(dist > 5.0)
			return vec2(minDist, float(i));
	}

	return vec2(minDist, float(ITERATIONS));

}
*/

void main(void) {
	vec2 uv = gl_FragCoord.xy / uResolution;
	/*
	vec2 result = mandelbrot(uv);
	float minDist = result.x;
	float iterations = result.y;
	float brightness = smoothstep(0.0, 0.03, minDist);
	vec3 col = hue(iterations / float(ITERATIONS));
	*/
	gl_FragColor = vec4(uv.x, uv.y, 0.0, 1.0); 
}
