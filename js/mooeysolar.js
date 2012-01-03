var constants = { 
	au: 1.49598e11, 
	G: 6.6738e-11, 
	Msol: 1.9891e30, 
	speed: 3000, 
	orbitScale: 4e-8, 
	planetScale: 2e-6
	};

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



Raphael("holder", 800, 600, function () {
    var r = this;
    r.planets = [
        {name: "Sun",
         r: 6.9e8,
         a: 1e-30,
         e: 0,
         tooltip: 'This is the sun, it is shiny.'},
        {name: "Mercury",
         r: 2.44e6,
         a: 5.7e10,
         e: 0.206,
		 tooltip: ''},
        {name: "Venus",
         r: 6.051e6,
         a: 1.082e11,
         e: 0.0068,
		 tooltip: ''}, 
        {name: "Earth",
         r: 6.3e6,
         a: 1 * constants.au,
         e: 0.0167,
		 tooltip: ''},
        {name: "Mars",
         r: 3.396e6,
         a: 2.279e11,
         e: 0.093,
		 tooltip: ''},
        {name: "Jupiter",
         r: 6.7e7,
         a: 5.204 * constants.au,
         e: 0.0488,
		 tooltip: ''},
        {name: "Saturn",
         r: 6.027e7,
         a: 1.4334e12,
         e: 0.0557,
		 tooltip: ''},
        {name: "Uranus",
         r:2.556e7,
         a: 2.8768e12,
         e: 0.0444,
		 tooltip: ''},
        {name: "Neptune",
            r: 2.48e7,
            a: 4.503e12,
            e: 0.0112,
		 tooltip: ''}
	];
    // Global reference for the ui stuff to get at it.
    // Should really make some sort of glue code instead.
    window.r = this;
        var someTransform = {x:400, y:200, angle:0, scale: Math.sqrt(constants.orbitScale*zoomFac)};
        window.someTransform = someTransform;
    r.planets.forEach(function(thisPlanet){
        // Object to hold the relevant maths/position cache.
        thisPlanet.planet = new planet({a:thisPlanet.a, e:thisPlanet.e}, 
                                       someTransform);
        // Thing that is displayed. Needs a better name.
        thisPlanet.thing = r.circle(0, 0, Math.sqrt(thisPlanet.r * constants.planetScale*zoomFac));
        thisPlanet.thing.attr({stroke: "#0080a4", fill: "#00c7ff"});
		thisPlanet.thing.node.id = thisPlanet.name;
		thisPlanet.thing.node.name = thisPlanet.name;
        $(('#' + thisPlanet.name)).qtip({
            content: thisPlanet.tooltip || 'Default tooltip string.',
			position: {
				corner: {
					target: 'topMiddle',
					tooltip: 'bottomMiddle'
				}
			},
			style: { 
				width: 200,
				padding: 5,
				background: '#A2D959',
				color: 'black',
				textAlign: 'center',
				border: {
					width: 7,
					radius: 5,
					color: '#A2D959'
				},
				tip: 'bottomMiddle',
				name: 'dark' // Inherit the rest of the attributes from the preset dark style
			}
        });

        // Something to do with the animation, copied directly from example.
        thisPlanet.thing.onAnimation(function () {
                                var t = this.attr("transform");
                           });
        // Label
 /*       thisPlanet.text = r.text(0,-Math.sqrt(thisPlanet.r * constants.planetScale) - 15,thisPlanet.name);
        thisPlanet.text.attr({font: "12px Helvetica", "font-weight": "bold",opacity: 0.7, fill: "#0080a4"});
        thisPlanet.text.onAnimation(function() {
            var t = this.attr("transform");});
        // Show label on hover.
        thisPlanet.thing.hover(function(){thisPlanet.text.show();}, function(){thisPlanet.text.hide();});
        thisPlanet.text.hide(); */
		
        // Tell raphael what to do to update the transformation during animation.
        // It passes a parameter v which it increases when we call animate.
        r.customAttributes[thisPlanet.name] = function(v) {
            return thisPlanet.planet.returnTransform(v);
        };
        // Pretty color.
        r.planets[0].thing.attr({fill: "#FF9100", stroke: "FF5500"});
    });

    var yr = 3600 * 24 * 365.25;
    var t0 = 0;
    var t1;
    // Not quite sure what I'm doing here. All the examples passed a function
    // in by name. This made them difficult to enumerate any other way.
    var params = [],
        param2 = [];
    r.planets.forEach(function(thisPlanet,idx){
         params[idx] = {};
         params[idx][thisPlanet.name] = t0;
         thisPlanet.thing.attr(params[idx]);
         //thisPlanet.text.attr(params[idx]);
    });

    function run() {
        t1 = t0 +yr * constants.speed / 105000;
        r.planets.forEach(function(thisPlanet,idx){
            // Same piece of kludge as above.
            params[idx][thisPlanet.name] = t1;

            if (thisPlanet.name === 'Earth') {
                 // Callback on one of the planets.
                 // This way the animation will keep going.
                 // Somewhat kludgy. Alternatives are:
                 // Find a way to tell raphael to play indefinitely
                 // Add another element to the animation that isn't a planet and put the callback on that
                 // The planet animations could also be synchronised with said object which would be beneficial.
                 thisPlanet.thing.animate(params[idx],1e3,function () {
                     if (thisPlanet.name === 'Earth'){
                         setTimeout(run);
                     }
                 });
            } else {
                // If not our special planet, then animate it.
                // Everything should be synchronised every second.
                thisPlanet.thing.animate(params[idx], 1e3);
            }
            //thisPlanet.text.animate(params[idx], 1e3);
        });
        t0 = t1; // Not sure if I need this anymore. Relic of putting things back at the beginning of their path when done.
    }
    run();
});


