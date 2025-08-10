import * as CANVAS from './canvas.js';
import * as UTIL from './util.js';
import * as DRAW from './draw.js';

export const toggleCurves = () => {
	const curves = document.getElementById('curves').checked;
	const curvesCanvas = document.getElementById('curves-canvas');
	const curvesCtx = curvesCanvas.getContext('2d');

	if(curves)
		curvesCanvas.classList.remove('hidden');
	else
		curvesCanvas.classList.add('hidden');

	CANVAS.clearCanvas(curvesCanvas);
	CANVAS.updateCanvases();
}

export const updateCurves = () => {
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
