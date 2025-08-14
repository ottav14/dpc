export const clearCanvas = (canvas) => {
	const ctx = canvas.getContext('2d');
	const blur = parseInt(document.getElementById('blur').value);
	ctx.fillStyle = `rgba(255, 255, 255, ${1-blur/100})`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export const selectCanvas = () => {
	document.getElementById('dps-canvas').classList.add('hidden');
	document.getElementById('curves-canvas').classList.add('hidden');
	document.getElementById('fractal-canvas').classList.add('hidden');

	const mode = document.getElementById('mode-select').value;

	document.getElementById(`${mode}-canvas`).classList.remove('hidden');
}
