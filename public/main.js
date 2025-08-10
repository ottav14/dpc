import * as PARAMS from './params.js';
import * as UTIL from './util.js';
import * as DRAW from './draw.js';
import Pendulum from './Pendulum.js';
import DoublePendulum from './DoublePendulum.js';
import initFractalDisplay from './FractalDisplay.js';

const pendulumCanvas = document.getElementById('dps-canvas');
const fractalCanvas = document.getElementById('fractal-canvas');
const gl = fractalCanvas.getContext('webgl');
const ctx = pendulumCanvas.getContext('2d'); 
let dps = [];
const timestep = 0.001;
const fractalMoveSpeed= 0.015;
const fractalZoomSpeed= 1.05;
const fractalSmoothing = 0.05;
let time = 0;
const names = [
	'count',
	'blur',
	'theta1',
	'theta2',
	'mass1',
	'mass2',
	'length1',
	'length2',
	'stacked',
	'angleDisplay',
];

let keysHeld = [];

const fractalUniforms = [
	{ name: 'Position', value: [0.0, 0.0], size: 2 },
	{ name: 'Zoom',     value: 20,         size: 1 },
	{ name: 'Time',     value: 0,          size: 1 },
	{ name: 'M0',       value: 1,          size: 1 },
	{ name: 'L0',       value: 1,          size: 1 },
	{ name: 'M1',       value: 1,          size: 1 },
	{ name: 'L1',       value: 1,          size: 1 },
];

let desiredFractalPosition = [0.0, 0.0];
let desiredFractalZoom = 20;

const state = {
	count: 2,
	blur: 0,
	theta1: 0.5 * Math.PI,
	theta2: 0,
	mass1: 10,
	mass2: 10,
	length1: 200,
	length2: 200,
	width: 10,
	radius: 30,
	stacked: false,
	angleDisplay: false,
}

const modes = ['dps', 'curves', 'fractal'];
let mode = 'dps';

const clearCanvas = (ctx) => {
	ctx.fillStyle = `rgba(255, 255, 255, ${1-state.blur/100})`;
	ctx.fillRect(0, 0, pendulumCanvas.width, pendulumCanvas.height);
}

const setCanvasSize = (w, h, c) => {
	c.width = w;
	c.height = h;
}

const selectCanvas = (mode) => {
	for(const m of modes) {
		const current = document.getElementById(`${m}-canvas`);
		current.classList.add('hidden');
	}

	document.getElementById(`${mode}-canvas`).classList.remove('hidden');
}

const updateInitialConditions = () => {
	for(const name of names) {
		const control = document.getElementById(name);
		if(control.type == 'checkbox')
			state[name] = control.checked; 
		else
			state[name] = parseInt(control.value); 
	}
	fractalUniforms[3].value = document.getElementById('mass1').value;
	fractalUniforms[4].value = document.getElementById('length1').value;
	fractalUniforms[5].value = document.getElementById('mass2').value;
	fractalUniforms[6].value = document.getElementById('length2').value;

	updateCanvases();
	updateFractalUniforms();
	init();
}

const updateAngleDisplay = () => {
	state.angleDisplay = document.getElementById('angleDisplay').checked;
}

const updateCanvases = () => {
	const curvesCanvas = document.getElementById('curves-canvas');
	const hiddenCanvasContainer = document.getElementById('hidden-canvas-container');

	const active = [];
	if(state.dps) active.push(pendulumCanvas);
	if(state.curves) active.push(curvesCanvas);
	if(state.fractal) active.push(fractalCanvas);

	switch(active.length) {
		case 0:
			break;
		case 1:
			setCanvasSize(1024, 720, active[0]);
			break;
		case 2:
			setCanvasSize(512, 720, active[0]);
			setCanvasSize(512, 720, active[1]);
			break;
		case 3:
			setCanvasSize(512, 720, pendulumCanvas);
			setCanvasSize(512, 360, curvesCanvas);
			setCanvasSize(512, 360, fractalCanvas);
			break;
	}

}

const setPivotPoints = () => {
	const y = 200;
	for(let i=0; i<dps.length; i++) {
		const x = state.stacked ? 0.5*pendulumCanvas.width : (i+1)*pendulumCanvas.width/(state.count+1);
		dps[i].p1.x = x;
		dps[i].p1.y = y;
	}
}

const toggleStacked = () => {
	const stackedControl = document.getElementById('stacked');
	state['stacked'] = stackedControl.checked; 

	const angleDisplayContainer = document.getElementById('angleDisplay-container');
	const angleDisplay = document.getElementById('angleDisplay');
	if(stackedControl.checked) {
		angleDisplayContainer.classList.add('hidden');
		angleDisplay.checked = false;
		state['angleDisplay'] = false;
	}
	else
		angleDisplayContainer.classList.remove('hidden');

	setPivotPoints();
}

const updateCurves = () => {
	const curvesCanvas = document.getElementById('curves-canvas');
	const curvesCtx = curvesCanvas.getContext('2d');

	curvesCtx.fillStyle = 'rgba(255, 255, 255, 0.01)';
	curvesCtx.fillRect(0, 0, curvesCanvas.width, curvesCanvas.height);

	for(let i=0; i<dps.length; i++) {
		const x = 1/2*curvesCanvas.width / Math.PI * UTIL.mod(dps[i].p1.t+0.5*Math.PI, 2*Math.PI);
		const y = 1/2*curvesCanvas.height / Math.PI * UTIL.mod(dps[i].p2.t+0.5*Math.PI, 2*Math.PI);
		const [r, g, b] = UTIL.hue(10*i%255);
		DRAW.fillCircle(curvesCtx, x, y, 20, `rgba(${r}, ${g}, ${b}, 1)`);
	}

	
}

const hideControl = (name) => {
	document.getElementById(`${name}-container`).classList.add('hidden');
}

const unhideAllControls = () => {
	for(const name of names) {
		document.getElementById(`${name}-container`).classList.remove('hidden');
	}
}

const handleModeChange = () => {

	const modeControl = document.getElementById('mode-select');
	mode = modeControl.value;
	selectCanvas(mode);
	switch(mode) {
		case 'dps':
			unhideAllControls();
			document.getElementById('length1').value = 200;
			document.getElementById('length2').value = 200;
			break;
		case 'curves':
			unhideAllControls();
			hideControl('blur');
			hideControl('stacked');
			hideControl('angleDisplay');
			document.getElementById('length1').value = 200;
			document.getElementById('length2').value = 200;
			break;
		case 'fractal':
			unhideAllControls();
			hideControl('count');
			hideControl('blur');
			hideControl('theta1');
			hideControl('theta2');
			hideControl('stacked');
			hideControl('angleDisplay');
			document.getElementById('length1').value = 1;
			document.getElementById('length2').value = 1;
			break;
	}
	updateInitialConditions();

}

const updateFractalUniforms = () => {

	fractalUniforms[2].value = time;
	fractalUniforms[0].value[0] = lerp(fractalUniforms[0].value[0], desiredFractalPosition[0], fractalSmoothing);
	fractalUniforms[0].value[1] = lerp(fractalUniforms[0].value[1], desiredFractalPosition[1], fractalSmoothing);
	fractalUniforms[1].value = lerp(fractalUniforms[1].value, desiredFractalZoom, fractalSmoothing);

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

const lerp = (a, b, t) => {
	return a + (b - a) * t;
}

const handleKeyDown = (e) => {
	keysHeld.push(e.key);
}

const handleKeyUp = (e) => {
	keysHeld = keysHeld.filter(key => key !== e.key);
}

const handleFractalInput = (e) => {
	const zoom = fractalUniforms[1].value;
	const moveVector = [0, 0];
	if(mode == 'fractal') {
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

const initControls = () => {

	for(const name of names) {
		const control = document.getElementById(name);
		control.addEventListener('input', updateInitialConditions);
		control.value = state[name];
	}
	const angleDisplayControl = document.getElementById('angleDisplay');
	angleDisplayControl.removeEventListener('input', updateInitialConditions);
	angleDisplayControl.addEventListener('input', updateAngleDisplay);

	const stackedControl = document.getElementById('stacked');
	stackedControl.removeEventListener('input', updateInitialConditions);
	stackedControl.addEventListener('input', toggleStacked);

	const modeControl = document.getElementById('mode-select');
	modeControl.addEventListener('input', handleModeChange);

	window.addEventListener('keydown', (e) => handleKeyDown(e));
	window.addEventListener('keyup', (e) => handleKeyUp(e));

}
initControls();

const init = () => {

	const curvesCtx = document.getElementById('curves-canvas').getContext('2d');
	clearCanvas(ctx);
	clearCanvas(curvesCtx);
	dps = [];
	PARAMS.setDPCount(0);

	const x0 = state.stacked ? 0.5*pendulumCanvas.width : pendulumCanvas.width/(state.count+1); 
	const y = 200;
	dps.push(new DoublePendulum(x0, y, state.theta1, state.mass1, state.length1, state.theta2, state.mass2, state.length2, state.width, state.radius, true));
	for(let i=1; i<state.count; i++) {
		const x = state.stacked ? 0.5*pendulumCanvas.width : (i+1)*pendulumCanvas.width/(state.count+1);
		dps.push(new DoublePendulum(x, y, state.theta1-0.05*i, state.mass1, state.length1, state.theta2, state.mass2, state.length2, state.width, state.radius, false));
	}

}

function update() {

	for(const dp of dps) {
		dp.update();
	}
	time += timestep;
	switch(mode) {
		case 'dps':
			clearCanvas(ctx);
			for(const dp of dps) {
				dp.display(ctx, state.angleDisplay);
			}
			break;
		case 'curves':
			updateCurves();
			break;
		case 'fractal':
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			handleFractalInput();
			break;

	}
	updateFractalUniforms();

  requestAnimationFrame(update);
}

updateCurves();
const program = await initFractalDisplay(fractalCanvas, gl);
handleModeChange();
updateFractalUniforms();
updateInitialConditions();
update();
