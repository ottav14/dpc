import Pendulum from './Pendulum.js';
import * as PARAMS from './params.js';
import * as UTIL from './util.js';

class DoublePendulum {

	constructor(x, y, t1, m1, t2, m2, l, w, r, first) {
		
		this.l1 = l;
		this.l2 = l;

		const x2 = x + this.l * Math.cos(t1);
		const y2 = y + this.l * Math.sin(t1);

		this.p1 = new Pendulum(x, y, t1, m1, l, w, r, first);
		this.p2 = new Pendulum(x2, y2, t2, m2, l, w, r, first);

	}

	update() {

		const term1a = -PARAMS.g * (2 * this.p1.m + this.p2.m) * Math.sin(this.p1.t);
		const term1b = -this.p2.m * PARAMS.g * Math.sin(this.p1.t - 2 * this.p2.t);
		const term1c = -2 * Math.sin(this.p1.t - this.p2.t) * this.p2.m;
		const term1d = this.p2.vel * this.p2.vel * this.l2 + this.p1.vel * this.p1.vel * this.l1 * Math.cos(this.p1.t - this.p2.t);
		const term1e = this.l1 * (2 * this.p1.m + this.p2.m - this.p2.m * Math.cos(2 * this.p1.t - 2 * this.p2.t));

		const term2a = 2 * Math.sin(this.p1.t - this.p2.t);
		const term2b = this.p1.vel * this.p1.vel * this.l1 * (this.p1.m + this.p2.m);
		const term2c = PARAMS.g * (this.p1.m + this.p2.m) * Math.cos(this.p1.t);
		const term2d = this.p2.vel * this.p2.vel * this.l2 * this.p2.m * Math.cos(this.p1.t - this.p2.t);
		const term2e = this.l2 * (2 * this.p1.m + this.p2.m - this.p2.m * Math.cos(2 * this.p1.t - 2 * this.p2.t));

		const newAcc1 = (term1a + term1b + term1c * term1d) / term1e;
		const newAcc2 = term2a * (term2b + term2c + term2d) / term2e;

		this.p1.acc = newAcc1;
		this.p2.acc = newAcc2;

		this.p1.vel += this.p1.acc;
		this.p1.vel = Math.min(PARAMS.maxVel, this.p1.vel);
		this.p1.t += this.p1.vel;
		if(this.p1.t > 2*Math.PI)
			this.p1.t -= 2*Math.PI;
		else if(this.p1.t < -2*Math.PI)
			this.p1.t += 2*Math.PI;

		this.p2.x = this.p1.x + this.l1 * Math.sin(this.p1.t+Math.PI);
		this.p2.y = this.p1.y - this.l1 * Math.cos(this.p1.t+Math.PI);
		this.p2.vel += this.p2.acc;
		this.p2.vel = Math.min(PARAMS.maxVel, this.p2.vel);
		this.p2.t += this.p2.vel;
		if(this.p2.t > 2*Math.PI)
			this.p2.t -= 2*Math.PI;
		else if(this.p2.t < -2*Math.PI)
			this.p2.t += 2*Math.PI;

	}

	display(ctx, angleDisplay) {
		
		this.p2.display(ctx, angleDisplay);
		this.p1.display(ctx, angleDisplay);

	}

}
export default DoublePendulum;
