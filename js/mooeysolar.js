'use strict';

var constants = { 
	au: 1.49598e11, 
	G: 6.6738e-11, 
	Msol: 1.9891e30, 
	speed: 3000, 
	orbitScale: 4e-8, 
	planetScale: 2e-6
	};

var center_pos = {x: 450,y: 250};
var zoomFac = 1;

var solveKepler = function(a, e, p, t, transform,pos) {

    var ERRORLIMIT = 0.001, // Limit on the improvement per iteration.
        ITERLIMIT = 100,    // Limit on number of iterations.
        SQRDIST = true,     // Flag for taking square roots of distances to fit them all on the screen.
        x,y,r,
        // Cache some maths out of habit. Not strictly necessary, but
        // increases readability and speed.
        round = Math.round,
        abs = Math.abs,
        sqrt = Math.sqrt,
        cos = Math.cos,
        sin = Math.sin,
        atan2 = Math.atan2,

        // Mean anomaly. Goes from 0 at t=0 to 2pi at t= 1 period.
        M = t/p * 6.283,
        // Eccentric anomaly.
        E0, E1,
        // True anomaly
        tanom,

        // Paramaters for an affine transformation, 
        // so semi-major axis isn't always horizontal
        // and centre of ellipse isn't at 0,0.
        ca = cos(transform.angle) * transform.scale,
        sa = sin(transform.angle) * transform.scale,
        dx = transform.x,
        dy = transform.y;


        // Iterative solution to kepler's equation.
        E0 = 0;
        E1 = M + e * sin(E0);
        // Improve our value for eccentric anomaly while the improvement in relative error
        // is greater than our limit, unless we exceed the iteration limit.
        while ( ITERLIMIT-- && (abs((E1 - E0) / E1) > ERRORLIMIT) ) {
            E0 = E1;
            E1 = M + e * sin(E0);
        }

        // Solve for r, theta, x and y.
        tanom = 2 * atan2(sqrt(1 + e)* sin (E1/2), sqrt(1 + e) * cos(E1/2));
        r = a * (1 - e*e) / (1 - e * cos(tanom));
        x = sqrt(r) * cos(tanom);
        y = sqrt(r) * sin(tanom);
        // Return transformed coordinates.
        
        pos[0] = x * ca - y * sa + dx;
        pos[1] = x * sa + y * ca + dy;
};

// Planet with:
// params consisting of:
//      a - Semi-major axis
//      e - eccentricity
//      p - period, calculated if omitted.
// transform - affine transform consisting of
//      x - x position of centre of ellipse
//      y - y position of centre of ellipse
//      angle - angle of semi-major axis from x axis.i
var planet = function (params, transform) {
    this.a = params.a; // TODO: Calculate a from p if p and not a is given. Also calculate both + angle from r0,v0.
    this.e = params.e;
    this.p = params.p ? params.p : 2 * Math.PI * Math.sqrt( Math.pow(this.a,3) / (constants.G * constants.Msol));
    this.transform = transform;
    this.pos = [];
    // solveKepler is iterative. Cache results for speed -- turns out it needs a lot of cache if it's linear in t,
    // may be better without as the iteration converges quite quickly.
    this.returnTransform = function(v) {
        if (!this.transformholder){
            this.transformholder = {transform: ''};
        }
        solveKepler(this.a, this.e,this.p, v, someTransform,this.pos);
        this.transformholder.transform =  "t" + this.pos.toString() + ',r0';
        return this.transformholder;
//        if ( !this.cache ) {
//            this.cache = [];
//        }
//        cacheIdx = (Math.round(v%this.p / this.p * 1000))|0;
//        if ( this.cache[cacheIdx] ) {
//            return this.cache[cacheIdx];
//        } 
//        else {
//            solveKepler(this.a, this.e,this.p, v, someTransform,this.pos);
//            this.cache[cacheIdx] =  {transform: "t" + this.pos.toString() + ',r0'};
//            return this.cache[cacheIdx];
//        }
    };

};





