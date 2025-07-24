import * as PARAMS from './params.js';
import * as UTIL from './util.js';
import Pendulum from './Pendulum.js';
import DoublePendulum from './DoublePendulum.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); 
const dps = [];
const dpCount = 10;
const timestep = 0.001;
let time = 0;

const clearCanvas = () => {
	const [r, g, b] = UTIL.hue(255*UTIL.triangleWave(time));
	ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const createRandomDP = () => {
	const m = 10;
	const t1 = Math.random()*2*Math.PI; 
	const t2 = Math.random()*2*Math.PI; 
	dps.push(new DoublePendulum(0.5*canvas.width, 200, t1, m, t2, m));
}

for(let i=0; i<dpCount; i++) {
	dps.push(new DoublePendulum(0.5*canvas.width, 200, 0.5*Math.PI+0.01*i, 10-0.3*i, -0.5*Math.PI, 10-0.3*i));
}


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

