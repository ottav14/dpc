import * as PARAMS from './params.js';
import * as UTIL from './util.js';
import * as DRAW from './draw.js';
import Pendulum from './Pendulum.js';
import DoublePendulum from './DoublePendulum.js';
import initFractalDisplay from './FractalDisplay.js';

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d'); 
let dps = [];
const timestep = 0.001;
let time = 0;
const names = [
	'count',
	'blur',
	'theta1',
	'theta2',
	'mass1',
	'mass2',
	'stacked',
	'angleDisplay',
	'curves'
];

const state = {
	count: 2,
	blur: 0,
	theta1: 0.5 * Math.PI,
	theta2: 0,
	mass1: 10,
	mass2: 10,
	length: 200,
	width: 10,
	radius: 30,
	stacked: false,
	angleDisplay: false,
	curves: false
}

const clearCanvas = (ctx) => {
	ctx.fillStyle = `rgba(255, 255, 255, ${1-state.blur/100})`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const updateInitialConditions = () => {
	for(const name of names) {
		const control = document.getElementById(name);
		if(name == 'stacked' || name == 'angleDisplay') {
			state[name] = control.checked; 

			if(name == 'stacked') {
				const angleDisplayContainer = document.getElementById('angleDisplayContainer');
				const angleDisplay = document.getElementById('angleDisplay');
				if(control.checked) {
					angleDisplayContainer.classList.add('hidden');
					angleDisplay.checked = false;
					state['angleDisplay'] = false;
				}
				else
					angleDisplayContainer.classList.remove('hidden');
			}

		}
		else { 
			state[name] = parseInt(control.value); 
		}
	}
	init();
}

const updateAngleDisplay = () => {
	state.angleDisplay = document.getElementById('angleDisplay').checked;
}

const setPivotPoints = () => {
	const y = 200;
	for(let i=0; i<state.count; i++) {
		const x = state.stacked ? 0.5*canvas.width : (i+1)*canvas.width/(state.count+1);
		dps[i].p1.x = x;
		dps[i].p1.y = y;
	}
}

const toggleCurves = () => {
	state.curves = document.getElementById('curves').checked;
	const curvesCanvas = document.getElementById('curves-canvas');
	const curvesCtx = curvesCanvas.getContext('2d');

	if(state.curves) {
		curvesCanvas.classList.remove('hidden');
		canvas.width = 512;
	}
	else {
		curvesCanvas.classList.add('hidden');
		canvas.width = 1024;
	}
	setPivotPoints();
	clearCanvas(curvesCtx);
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

const initControls = () => {

	for(const name of names) {
		const control = document.getElementById(name);
		control.addEventListener('input', updateInitialConditions);
		control.value = state[name];
	}
	const angleDisplayControl = document.getElementById('angleDisplay');
	angleDisplayControl.removeEventListener('input', updateInitialConditions);
	angleDisplayControl.addEventListener('input', updateAngleDisplay);

	const curvesControl = document.getElementById('curves');
	curvesControl.removeEventListener('input', updateInitialConditions);
	curvesControl.addEventListener('input', toggleCurves);
}
initControls();

const init = () => {

	const curvesCtx = document.getElementById('curves-canvas').getContext('2d');
	clearCanvas(ctx);
	clearCanvas(curvesCtx);
	dps = [];
	PARAMS.setDPCount(0);

	const x0 = state.stacked ? 0.5*canvas.width : canvas.width/(state.count+1); 
	const y = 200;
	dps.push(new DoublePendulum(x0, y, state.theta1, state.mass1, state.theta2, state.mass2, state.length, state.width, state.radius, true));
	for(let i=1; i<state.count; i++) {
		const x = state.stacked ? 0.5*canvas.width : (i+1)*canvas.width/(state.count+1);
		dps.push(new DoublePendulum(x, y, state.theta1-0.05*i, state.mass1, state.theta2, state.mass2, state.length, state.width, state.radius, false));
	}

}
document.addEventListener('DOMContentLoaded', updateInitialConditions);

function update() {

	clearCanvas(ctx);
	for(const dp of dps) {
		dp.update();
		dp.display(ctx, state.angleDisplay);
	}
	time += timestep;

	updateCurves();

  requestAnimationFrame(update);
}
requestAnimationFrame(update);

toggleCurves();
updateCurves();

