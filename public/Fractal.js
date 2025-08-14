import { getKeysHeld } from './controls.js';
import * as UTIL from './util.js';

const fractalUniforms = [
	{ name: 'Position', value: [0.0, 0.0], size: 2 },
	{ name: 'Zoom',     value: 20,         size: 1 },
	{ name: 'Time',     value: 0,          size: 1 },
	{ name: 'M0',       value: 1,          size: 1 },
	{ name: 'L0',       value: 1,          size: 1 },
	{ name: 'M1',       value: 1,          size: 1 },
	{ name: 'L1',       value: 1,          size: 1 },
];

const fractalMoveSpeed= 0.015;
const fractalZoomSpeed= 1.05;
const fractalSmoothing = 0.05;
const fractalCanvas = document.getElementById('fractal-canvas');
const gl = fractalCanvas.getContext('webgl');
const timestep = 0.001;
let desiredFractalPosition = [0.0, 0.0];
let desiredFractalZoom = 20;
let time = 0;

export const updateFractalUniforms = () => {

	time += timestep;
	fractalUniforms[3].value = document.getElementById('mass1').value;
	fractalUniforms[4].value = document.getElementById('length1').value;
	fractalUniforms[5].value = document.getElementById('mass2').value;
	fractalUniforms[6].value = document.getElementById('length2').value;
	fractalUniforms[2].value = time;
	fractalUniforms[0].value[0] = UTIL.lerp(fractalUniforms[0].value[0], desiredFractalPosition[0], fractalSmoothing);
	fractalUniforms[0].value[1] = UTIL.lerp(fractalUniforms[0].value[1], desiredFractalPosition[1], fractalSmoothing);
	fractalUniforms[1].value = UTIL.lerp(fractalUniforms[1].value, desiredFractalZoom, fractalSmoothing);

	for(let i=0; i<fractalUniforms.length; i++) {
		const u = fractalUniforms[i];
		const uniformLocation = gl.getUniformLocation(program, 'u' + u.name);
		switch(u.size) {
			case 1:
				gl.uniform1f(uniformLocation, u.value);
				break;
			case 2:
				gl.uniform2f(uniformLocation, u.value[0], u.value[1]);
				break;
		}
	}
}


const loadShaderSource = async (url) => {
	const response = await fetch(url);
	return await response.text();
}

const initShaders = async (gl) => {
	const vsSource = await loadShaderSource('shaders/vertex.glsl');
	const fsSource = await loadShaderSource('shaders/fragment.glsl');

	const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Program failed to link:', gl.getProgramInfoLog(program));
		return null;
	}

	return program;
}

const compileShader = (gl, type, source) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('Shader compile error:', gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

export const initFractalDisplay = async (canvas, gl) => {

	const program = await initShaders(gl);
	gl.useProgram(program);

	// Set uniform values
	const uResolutionLocation = gl.getUniformLocation(program, 'uResolution');
	gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);

	// Define square with two triangles
	const vertices = new Float32Array([
		// First triangle
		-1.0,  1.0,  // top-left
		-1.0, -1.0,  // bottom-left
		1.0,  1.0,  // top-right

		// Second triangle
		1.0,  1.0,  // top-right
		-1.0, -1.0,  // bottom-left
		1.0, -1.0   // bottom-right
	]);

	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	const aPosition = gl.getAttribLocation(program, 'aPosition');
	gl.enableVertexAttribArray(aPosition);
	gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, 6);

	return program;
}

export const handleFractalInput = () => {
	const zoom = fractalUniforms[1].value;
	const moveVector = [0, 0];
	const mode = document.getElementById('mode-select').value;
	const keysHeld = getKeysHeld();
	if(mode === 'fractal') {
		if(keysHeld.includes('w'))
			moveVector[1] += zoom*fractalMoveSpeed;
		if(keysHeld.includes('a'))
			moveVector[0] -= zoom*fractalMoveSpeed;
		if(keysHeld.includes('s'))
			moveVector[1] -= zoom*fractalMoveSpeed;
		if(keysHeld.includes('d'))
			moveVector[0] += zoom*fractalMoveSpeed;
		if(keysHeld.includes('ArrowUp'))
			desiredFractalZoom /= fractalZoomSpeed;
		if(keysHeld.includes('ArrowDown'))
			desiredFractalZoom *= fractalZoomSpeed;

		const mag = Math.sqrt(moveVector[0]*moveVector[0] + moveVector[1]*moveVector[1]);
		if(mag !== 0) {
			desiredFractalPosition[0] += fractalMoveSpeed * zoom * moveVector[0] / mag;
			desiredFractalPosition[1] += fractalMoveSpeed * zoom * moveVector[1] / mag;
		}
		updateFractalUniforms();

	}
}
const program = await initFractalDisplay(fractalCanvas, gl);

