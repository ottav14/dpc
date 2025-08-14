import Pendulum from './Pendulum.js';
import * as UTIL from './util.js';
import * as CANVAS from './canvas.js';

const pendulumWidth = 10;
const pendulumRadius = 30;
const pendulumStaggering = 0.03;
const g = 1;
let dps = [];
let colorIndex = 0;

class DoublePendulum {

	constructor(x, y, w, r, t1, t2, initialConditions) {
		
		const m1 = initialConditions['mass1'];
		const m2 = initialConditions['mass2'];
		const l1 = initialConditions['length1'];
		const l2 = initialConditions['length2'];

		const x2 = x + l1 * Math.cos(t1);
		const y2 = y + l2 * Math.sin(t1);

		this.l1 = l1;
		this.l2 = l2;
		this.p1 = new Pendulum(x, y, t1, m1, l1, w, r);
		this.p2 = new Pendulum(x2, y2, t2, m2, l2, w, r);
		this.color = 10*colorIndex % 255;
		colorIndex++;

	}

	update() {

		const term1a = -g * (2 * this.p1.m + this.p2.m) * Math.sin(this.p1.t);
		const term1b = -this.p2.m * g * Math.sin(this.p1.t - 2 * this.p2.t);
		const term1c = -2 * Math.sin(this.p1.t - this.p2.t) * this.p2.m;
		const term1d = this.p2.vel * this.p2.vel * this.l2 + this.p1.vel * this.p1.vel * this.l1 * Math.cos(this.p1.t - this.p2.t);
		const term1e = this.l1 * (2 * this.p1.m + this.p2.m - this.p2.m * Math.cos(2 * this.p1.t - 2 * this.p2.t));

		const term2a = 2 * Math.sin(this.p1.t - this.p2.t);
		const term2b = this.p1.vel * this.p1.vel * this.l1 * (this.p1.m + this.p2.m);
		const term2c = g * (this.p1.m + this.p2.m) * Math.cos(this.p1.t);
		const term2d = this.p2.vel * this.p2.vel * this.l2 * this.p2.m * Math.cos(this.p1.t - this.p2.t);
		const term2e = this.l2 * (2 * this.p1.m + this.p2.m - this.p2.m * Math.cos(2 * this.p1.t - 2 * this.p2.t));

		const newAcc1 = (term1a + term1b + term1c * term1d) / term1e;
		const newAcc2 = term2a * (term2b + term2c + term2d) / term2e;

		this.p1.acc = newAcc1;
		this.p2.acc = newAcc2;

		this.p1.vel += this.p1.acc;
		this.p1.t += this.p1.vel;
		if(this.p1.t > 2*Math.PI)
			this.p1.t -= 2*Math.PI;
		else if(this.p1.t < -2*Math.PI)
			this.p1.t += 2*Math.PI;

		this.p2.x = this.p1.x + this.l1 * Math.sin(this.p1.t+Math.PI);
		this.p2.y = this.p1.y - this.l1 * Math.cos(this.p1.t+Math.PI);
		this.p2.vel += this.p2.acc;
		this.p2.t += this.p2.vel;
		if(this.p2.t > 2*Math.PI)
			this.p2.t -= 2*Math.PI;
		else if(this.p2.t < -2*Math.PI)
			this.p2.t += 2*Math.PI;

	}

	display(ctx) {
		this.p2.display(ctx, this.color);
		this.p1.display(ctx, this.color);
	}

}
export default DoublePendulum;

const setPivotPoints = () => {
	const y = 200;
	const stacked = document.getElementById('stacked').checked;
	const count = parseInt(document.getElementById('count').value);
	const pendulumCanvas = document.getElementById('dps-canvas');
	for(let i=0; i<dps.length; i++) {
		const x = stacked ? 0.5*pendulumCanvas.width : (i+1)*pendulumCanvas.width/(count+1);
		dps[i].p1.x = x;
		dps[i].p1.y = y;
	}
}

export const toggleStacked = () => {
	const stackedControl = document.getElementById('stacked');

	const angleDisplayContainer = document.getElementById('angleDisplay-container');
	const angleDisplay = document.getElementById('angleDisplay');
	if(stackedControl.checked) {
		angleDisplayContainer.classList.add('hidden');
		angleDisplay.checked = false;
	}
	else
		angleDisplayContainer.classList.remove('hidden');

	setPivotPoints();
}

export const initPendulums = (initialConditions) => {

	const pendulumCanvas = document.getElementById('dps-canvas');
	const curvesCanvas = document.getElementById('curves-canvas');
	CANVAS.clearCanvas(pendulumCanvas);
	CANVAS.clearCanvas(curvesCanvas);
	dps = [];
	colorIndex = 0;

	const stacked = document.getElementById('stacked').checked;
	const count = parseInt(document.getElementById('count').value);
	const y = 200;
	for(let i=0; i<count; i++) {
		const x = stacked ? 0.5*pendulumCanvas.width : (i+1)*pendulumCanvas.width/(count+1);	
		const t0 = initialConditions['theta1'] + pendulumStaggering*i;
		const t1 = initialConditions['theta2'] + pendulumStaggering*i;
		dps.push(new DoublePendulum(x, y, pendulumWidth, pendulumRadius, t0, t1, initialConditions));
	}

}

export const updatePendulums = () => {
	for(const dp of dps) {
		dp.update();
	}
}

export const displayPendulums = (ctx) => {
	for(const dp of dps) {
		dp.display(ctx);
	}
}

export const getPendulums = () => {
	return dps;
}
