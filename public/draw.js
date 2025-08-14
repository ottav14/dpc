export const fillCircle = (ctx, x, y, r, col) => {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI); 
	ctx.fillStyle = col;
	ctx.fill();
}

export const strokeCircle = (ctx, x, y, r, col) => {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI); 
	ctx.strokeStyle = col;
	ctx.stroke();
}
