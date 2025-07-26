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
	'mass2'
];

const state = {
	count: 2,
	blur: 0,
	theta1: 0.5 * Math.PI,
	theta2: 0,
	mass1: 10,
	mass2: 10
}

const clearCanvas = () => {
	ctx.fillStyle = `rgba(255, 255, 255, ${1-state.blur/100})`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const createRandomDP = () => {
	const m = 10;
	const t1 = Math.random()*2*Math.PI; 
	const t2 = Math.random()*2*Math.PI; 
	dps.push(new DoublePendulum(0.5*canvas.width, 200, t1, m, t2, m));
}

const updateInitialConditions = () => {
	for(const name of names) {
		const control = document.getElementById(name);
		state[name] = parseInt(control.value); 
	}
	init();
}

const initControls = () => {

	for(const name of names) {
		const control = document.getElementById(name);
		control.addEventListener('input', updateInitialConditions);
		control.value = state[name];
	}
}
initControls();

const init = () => {

	clearCanvas();
	dps = [];
	for(let i=0; i<state.count; i++) {
		dps.push(new DoublePendulum(0.5*canvas.width, 200, state.theta1-0.05*i, state.mass1, state.theta2, state.mass2));
	}

}
document.addEventListener('DOMContentLoaded', updateInitialConditions);

function update() {

	clearCanvas();
	for(const dp of dps) {
		dp.update();
		dp.display(ctx);
	}
	time += timestep;

  requestAnimationFrame(update);
}
requestAnimationFrame(update);

