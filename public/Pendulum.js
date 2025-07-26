import * as PARAMS from './params.js';
import * as UTIL from './util.js';

class Pendulum {

	constructor(x, y, t, m) {
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
		PARAMS.incrementDPCount();
	}

	display(ctx) {
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(this.t);
		
		const [r, g, b] = UTIL.hue(this.color);
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
		ctx.fillRect(-0.5*this.w, 0, this.w, this.h);

		ctx.beginPath();
		ctx.arc(0, this.h, this.r, 0, Math.PI * 2); 
		ctx.fillStyle = 'black';
		ctx.fill();

		ctx.restore();
	}

}
export default Pendulum;
