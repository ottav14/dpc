import { setPivotPoints } from './DoublePendulum.js';

export const clearCanvas = (canvas) => {
	const ctx = canvas.getContext('2d');
	const blur = parseInt(document.getElementById('blur').value);
	ctx.fillStyle = `rgba(255, 255, 255, ${1-blur/100})`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export const setCanvasSize = (w, h, c) => {
	c.width = w;
	c.height = h;
}

export const updateCanvases = () => {
	const pendulumCanvas = document.getElementById('main-canvas');
	const curvesCanvas = document.getElementById('curves-canvas');
	const fractalCanvas = document.getElementById('fractal-canvas');
	const hiddenCanvasContainer = document.getElementById('hidden-canvas-container');
	const dps = document.getElementById('dps').checked;
	const curves= document.getElementById('curves').checked;
	const fractal = document.getElementById('fractal').checked;

	const active = [];
	if(dps) active.push(pendulumCanvas);
	if(curves) active.push(curvesCanvas);
	if(fractal) active.push(fractalCanvas);

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
	}

	setPivotPoints();

}
