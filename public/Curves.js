import * as CANVAS from './canvas.js';
import * as UTIL from './util.js';
import * as DRAW from './draw.js';
import * as DP from './DoublePendulum.js';

export const updateCurves = () => {
	const curvesCanvas = document.getElementById('curves-canvas');
	const curvesCtx = curvesCanvas.getContext('2d');

	curvesCtx.fillStyle = 'rgba(255, 255, 255, 0.01)';
	curvesCtx.fillRect(0, 0, curvesCanvas.width, curvesCanvas.height);

	const dps = DP.getPendulums();
	const hw = curvesCanvas.width / 2;
	const hh = curvesCanvas.height / 2;
	console.log(hh);
	for(let i=0; i<dps.length; i++) {
		const x = hw / Math.PI * UTIL.mod(dps[i].p1.t + hw, 2*Math.PI);
		const y = hh / Math.PI * UTIL.mod(dps[i].p2.t + hw, 2*Math.PI);
		const [r, g, b] = UTIL.hue(10*i%255);
		DRAW.fillCircle(curvesCtx, x, y, 20, `rgba(${r}, ${g}, ${b}, 1)`);
	}
	
}

