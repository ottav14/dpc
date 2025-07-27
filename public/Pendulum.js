import * as PARAMS from './params.js';
import * as UTIL from './util.js';

class Pendulum {

	constructor(x, y, t, m, first) {
		this.x = x;
		this.y = y;
		this.t = t;
		this.m = m;
		this.vel = 0;
		this.acc = 0;
		this.w = UTIL.getWidth(m);
		this.h = UTIL.getHeight(m);
		this.r = UTIL.getRadius(m);
		this.color = 10*PARAMS.currentDPCount % 255;
		this.first = first;
		PARAMS.incrementDPCount();
	}

	display(ctx, angleDisplay) {
		ctx.save();

		// Rod
		ctx.translate(this.x, this.y);
		ctx.rotate(this.t);
		
		const [r, g, b] = UTIL.hue(this.color);
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
		ctx.fillRect(-0.5*this.w, 0, this.w, this.h);

		// Bob
		ctx.beginPath();
		ctx.arc(0, this.h, this.r, 0, Math.PI * 2); 
		ctx.fillStyle = 'black';
		ctx.fill();

		// Angle display
		if(angleDisplay) {
			ctx.beginPath();
			ctx.arc(0, 0, 0.5*this.h, 0.5*Math.PI, -this.t+0.5*Math.PI, this.t > 0);
			ctx.strokeStyle = '#000';
			ctx.stroke();

			ctx.rotate(-this.t);
			ctx.fillStyle = '#000';
			ctx.fillRect(-1, 0, 2, this.h);
		}


		ctx.restore();
	}

}
export default Pendulum;
