import * as CANVAS from './canvas.js';
import * as DP from './DoublePendulum.js';
import { initPendulums } from './DoublePendulum.js';

let keysHeld = [];

export const getKeysHeld = () => {
	return keysHeld;
}

export const hideControl = (name) => {
	document.getElementById(`${name}-container`).classList.add('hidden');
}

export const unhideAllControls = (initialConditions) => {
	for(const name in initialConditions) {
		document.getElementById(`${name}-container`).classList.remove('hidden');
	}
}

const handleKeyDown = (e) => {
	keysHeld.push(e.key);
}

const handleKeyUp = (e) => {
	keysHeld = keysHeld.filter(key => key !== e.key);
}

export const updateInitialConditions = (initialConditions) => {
	for(const name in initialConditions) {
		const control = document.getElementById(name);
		if(control.type == 'checkbox')
			initialConditions[name] = control.checked; 
		else
			initialConditions[name] = parseInt(control.value); 
	}
	initPendulums(initialConditions);
}

export const initControls = (initialConditions) => {
	for(const name in initialConditions) {
		const control = document.getElementById(name);
		control.addEventListener('input', () => updateInitialConditions(initialConditions));
		if(control.type === 'checkbox')
			control.checked = initialConditions[name];
		else
			control.value = initialConditions[name];
	}

	const stackedControl = document.getElementById('stacked');
	stackedControl.removeEventListener('input', () => updateInitialConditions(initialConditions));
	stackedControl.addEventListener('input', () => DP.toggleStacked());

	const modeControl = document.getElementById('mode-select');
	modeControl.addEventListener('input', () => handleModeChange(initialConditions));

	window.addEventListener('keydown', (e) => handleKeyDown(e));
	window.addEventListener('keyup', (e) => handleKeyUp(e));

}

export const handleModeChange = (initialConditions) => {

	const mode = document.getElementById('mode-select').value;
	CANVAS.selectCanvas();
	switch(mode) {
		case 'dps':
			unhideAllControls(initialConditions);
			document.getElementById('length1').value = 200;
			document.getElementById('length2').value = 200;
			break;
		case 'curves':
			unhideAllControls(initialConditions);
			hideControl('blur');
			hideControl('stacked');
			hideControl('angleDisplay');
			document.getElementById('length1').value = 200;
			document.getElementById('length2').value = 200;
			break;
		case 'fractal':
			unhideAllControls(initialConditions);
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
	updateInitialConditions(initialConditions);

}
