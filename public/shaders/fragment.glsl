#define ITERATIONS 30
#define G 1.0

precision mediump float;

uniform vec2 uResolution;
uniform vec2 uPosition;
uniform float uZoom;
uniform float uTime;
uniform float uM0;
uniform float uM1;

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

vec4 evalDP(vec4 p) {

	float t0 = p.x;
	float v0 = p.y;
	float l0 = 1.0;
	float t1 = p.z;
	float v1 = p.w;
	float l1 = 1.0;
	float div = 2.0 * uM0 + uM1 - uM1 * cos(2.0 * t0 - 2.0 * t1);
	float diff = t0-t1;

	float term1a = G * (2.0 * uM0 + uM1) * sin(t0);
	float term1b = -uM1 * G * sin(t0 - 2.0 * t1);
	float term1c = -2.0 * sin(diff) * uM1;
	float term1d = v1 * v1 * l1 + v0 * v0 * l0 * cos(diff);
	float term1e = l0 * div;

	float term2a = 2.0 * sin(diff);
	float term2b = v0 * v1 * l0 * (uM0 + uM1);
	float term2c = G * (uM0 + uM1) * cos(t0);
	float term2d = v1 * v1 * l1 * uM1 * cos(diff);
	float term2e = l1 * div;

	v0 += (term1a + term1b + term1c * term1d) / term1e;
	v1 += term2a * (term2b + term2c + term2d) / term2e;

	t0 += v0;
	t1 += v1;

	return vec4(t0, v0, t1, v1);
}

float integrateDP(vec4 p) {
	vec4 y = p;
	const float h = 0.05;
	float maxSpeed = 0.0;
	for(int t = 0; t < ITERATIONS; t++) {
		vec4 k1 = evalDP(y);
		vec4 k2 = evalDP(y + h/2.0*k1);
		vec4 k3 = evalDP(y + h/2.0*k2);
		vec4 k4 = evalDP(y + h*k3);
		y += h/6.0*(k1 + 2.0*k2 + 2.0*k3 + k4);
		float speed = length(vec2(y.y, y.w));
		if(speed > maxSpeed)
			maxSpeed = speed;

		if(speed > 10.0)
			break;
	}
	return maxSpeed;
}

float dpFractal(vec2 p) {

	float res = integrateDP(vec4(p.x, sin(uTime), p.y, cos(uTime)));
		

	return res;

}

void main(void) {
	vec2 uv = gl_FragCoord.xy / uResolution;
	vec2 center = vec2(0.5, 0.5);
	vec2 cam = (uv - center) * uZoom + center + uPosition;
	float result = dpFractal(cam);
	vec3 col = hue(result);
	gl_FragColor = vec4(col, 1.0); 
}
