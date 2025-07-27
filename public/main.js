import * as PARAMS from './params.js';
import * as UTIL from './util.js';
import Pendulum from './Pendulum.js';
import DoublePendulum from './DoublePendulum.js';
import initFractalDisplay from './FractalDisplay.js';

const canvas = document.getElementById('canvas');
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
	'angleDisplay'
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
	angleDisplay: false
}

const clearCanvas = () => {
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

const initControls = () => {

	for(const name of names) {
		const control = document.getElementById(name);
		control.addEventListener('input', updateInitialConditions);
		control.value = state[name];
	}
	const angleDisplayControl = document.getElementById('angleDisplay');
	angleDisplayControl.removeEventListener('input', updateInitialConditions);
	angleDisplayControl.addEventListener('input', updateAngleDisplay);
}
initControls();

const init = () => {

	clearCanvas();
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

	clearCanvas();
	for(const dp of dps) {
		dp.update();
		dp.display(ctx, state.angleDisplay);
	}
	time += timestep;

  requestAnimationFrame(update);
}
requestAnimationFrame(update);

