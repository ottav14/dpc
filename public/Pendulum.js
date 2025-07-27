import * as PARAMS from './params.js';
import * as UTIL from './util.js';

class Pendulum {

	constructor(x, y, t, m, l, w, r, first) {
		this.x = x;
		this.y = y;
		this.t = t;
		this.m = m;
		this.vel = 0;
		this.acc = 0;
		this.w = w;
		this.l = l;
		this.r = r;
		this.color = 10*PARAMS.currentDPCount % 255;
		this.first = first;
		PARAMS.setDPCount(PARAMS.currentDPCount+1);
	}

	display(ctx, angleDisplay) {
		ctx.save();

		ctx.translate(this.x, this.y);

		// Angle display
		if(angleDisplay) {
			ctx.beginPath();
			ctx.arc(0, 0, 0.5*this.l, 0.5*Math.PI, this.t+0.5*Math.PI, this.t < 0);
			ctx.strokeStyle = '#000';
			ctx.stroke();

			ctx.fillStyle = '#000';
			ctx.fillRect(-1, 0, 2, this.l);
		}

		// Pivot
		ctx.rotate(this.t);
		ctx.beginPath();
		ctx.arc(0, 0, 0.5*this.w, 0, Math.PI * 2); 
		const [r, g, b] = UTIL.hue(this.color);
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1.0)`;
		ctx.fill();

		// Rod
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1.0)`;
		ctx.fillRect(-0.5*this.w, 0, this.w, this.l);

		// Bob
		ctx.beginPath();
		ctx.arc(0, this.l, this.r, 0, Math.PI * 2); 
		ctx.fillStyle = 'black';
		ctx.fill();

		ctx.restore();
	}

}
export default Pendulum;
