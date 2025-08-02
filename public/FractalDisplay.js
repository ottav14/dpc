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

const initFractalDisplay = async (canvas, gl) => {

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
}
export default initFractalDisplay;
