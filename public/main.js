import * as UTIL from './util.js';
import * as DRAW from './draw.js';
import * as CANVAS from './canvas.js';
import * as CURVES from './Curves.js';
import * as CONTROLS from './controls.js';
import Pendulum from './Pendulum.js';
import DoublePendulum from './DoublePendulum.js';
import * as DP from './DoublePendulum.js';
import * as FRACTAL from './Fractal.js';

const pendulumCanvas = document.getElementById('dps-canvas');
const curvesCanvas = document.getElementById('curves-canvas');
const fractalCanvas = document.getElementById('fractal-canvas');
const gl = fractalCanvas.getContext('webgl');
const ctx = pendulumCanvas.getContext('2d'); 

const initialConditions = {
	count: 2,
	blur: 1,
	theta1: 0.5 * Math.PI,
	theta2: 0,
	mass1: 10,
	mass2: 10,
	length1: 200,
	length2: 200,
	stacked: false,
	angleDisplay: false,
}

const modes = ['dps', 'curves', 'fractal'];

function update() {
	const mode = document.getElementById('mode-select').value;
	switch(mode) {
		case 'dps':
			CANVAS.clearCanvas(pendulumCanvas);
			DP.updatePendulums();
			DP.displayPendulums(ctx);
			break;
		case 'curves':
			DP.updatePendulums();
			CURVES.updateCurves();
			break;
		case 'fractal':
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			FRACTAL.handleFractalInput();
			FRACTAL.updateFractalUniforms();
			break;
	}
	requestAnimationFrame(update);
}

CONTROLS.initControls(initialConditions);
CONTROLS.handleModeChange(initialConditions);
DP.initPendulums(initialConditions);
update();
