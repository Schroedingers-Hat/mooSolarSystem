'use strict';

function init(space){
    space.planets = basePlanets;    // Global reference for the ui stuff to get at it.
    // Should really make some sort of glue code instead.
//    var someTransform = {x:center_pos.x, y:center_pos.y, angle:0, scale: Math.sqrt(constants.orbitScale*zoomFac)};
    var someTransform = {x:0, y:0, angle:0, scale: 1};
    window.someTransform = someTransform;
    //TODO: This is all still ugly. All this stuff should probably be handled by its own object.
    space.planets.forEach(function(thisPlanet){
        // Object to hold the relevant maths/position cache.
        thisPlanet.planet = new planet({a:thisPlanet.a, e:thisPlanet.e}, 
                                       someTransform);
        // Thing that is displayed. Needs a better name.
        thisPlanet.displayCircle = space.circle(0, 0, Math.sqrt(thisPlanet.r * constants.planetScale*zoomFac));
        thisPlanet.displayCircle.attr({stroke: "#0080a4", fill: "#00c7ff"});
		thisPlanet.displayCircle.node.id = thisPlanet.name;
		thisPlanet.displayCircle.node.name = thisPlanet.name;
        $(('#' + thisPlanet.name)).qtip({
            content: "<b>" + thisPlanet.tooltip + "</b><br />" + thisPlanet.distFromEarth + "<br /><img src='images/" + thisPlanet.name + ".jpg' height='50' />" || 'Spatial object.',
			position: {
				corner: {
					target: 'topMiddle',
					tooltip: 'bottomMiddle'
				}
			},
			style: { 
				width: 150,
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

        // SomedisplayCircle to do with the animation, copied directly from example.
        thisPlanet.displayCircle.onAnimation(function () {
                                var t = this.attr("transform");
                           });
		
        // Tell raphael what to do to update the transformation during animation.
        // It passes a parameter v which it increases when we call animate.
        space.customAttributes[thisPlanet.name] = function(v) {
            return thisPlanet.planet.returnTransform(v);
        };
        // Pretty colospace.
        space.planets[0].displayCircle.attr({fill: "#FF9100", stroke: "FF5500"});
    });
}


function go(space){
    var yr = 3600 * 24 * 365.25;
    var t1 = 0;
    // Not quite sure what I'm doing here. All the examples passed a function
    // in by name. This made them difficult to enumerate any other way.
    var params = [];
    space.planets.forEach(function(thisPlanet,idx){
         params[idx] = {};
         params[idx][thisPlanet.name] = t1;
         thisPlanet.displayCircle.attr(params[idx]);
         //thisPlanet.text.attr(params[idx]);
    });

    function run() {
        t1 += yr * constants.speed / 105000;
        space.planets.forEach(function(thisPlanet,idx){
            // Same piece of kludge as above.
            params[idx][thisPlanet.name] = t1;

            if (thisPlanet.name === 'Earth') {
                 // Callback on one of the planets.
                 // This way the animation will keep going.
                 // Somewhat kludgy. Alternatives are:
                 // Find a way to tell raphael to play indefinitely
                 // Add another element to the animation that isn't a planet and put the callback on that
                 // The planet animations could also be synchronised with said object which would be beneficial.
                 thisPlanet.displayCircle.animate(params[idx],1e3,function () {
                     if (thisPlanet.name === 'Earth'){
                         setTimeout(run);
                     }
                 });
            } else {
                // If not our special planet, then animate it.
                // EverydisplayCircle should be synchronised every second.
                thisPlanet.displayCircle.animate(params[idx], 1e3);
				// For the tooltip
				thisPlanet.distFromEarth = Math.sqrt(Math.pow((thisPlanet.displayCircle.cx - space.planets[3].displayCircle.cx),2) + 
                                                     Math.pow((thisPlanet.displayCircle.cy - space.planets[3].displayCircle.cy),2));
            }
        });
    }
    run();
}
