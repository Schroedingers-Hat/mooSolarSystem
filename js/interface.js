'use strict';
function inputHandler(){
    this.zoomFac = 0;
    this.speed = 1;
}



$(document).ready(function() {
	$( "#slider_speed" ).slider({
			value:35000,
			min: 100,
			max: 1000000,
			step: 10,
			slide: function( event, ui ) {
                $( "#control_speed" ).val( ui.value );
                constants.speed = ui.value;
			}
	});
	$( "#control_speed" ).val(  $( "#slider_speed" ).slider( "value" ) );

	$( "#slider_zoom" ).slider({
			value: 1,
			min: 0.01,
			max: 3,
			step: 0.01,
			slide: function( event, ui ) {
                $( "#control_zoom" ).val( ui.value );
                zoomFac = ui.value;
                someTransform.scale = Math.sqrt(constants.orbitScale * zoomFac);
                r.planets.forEach(function(thisPlanet){thisPlanet.thing.attr({r:(Math.sqrt(thisPlanet.r * zoomFac * constants.planetScale))});});
			}
	});

	$( "#control_zoom" ).val(  $( "#slider_zoom" ).slider( "value" ) );
	
	var oldselected = 0;
	$('#tabs').tabs();
    $('#tabs').bind('tabsselect', function(event, ui) {
        if ( ui.index === 0 ) {
				r.planets[ui.index].thing.attr({fill: "#FF9100", stroke: "FF5500"});
        }else {
            r.planets[ui.index].thing.attr({fill: "#FF0059", stroke: "#C200"});
        }
        if ( oldselected === 0 ) {

            r.planets[oldselected].thing.attr({fill: "#ffe230", stroke: "#ff7900"});
        } else {
            if ( r.planets[oldselected] ){
                r.planets[oldselected].thing.attr({fill: "#00c7ff", stroke: "#0080a4"});
            }
        }
        oldselected = ui.index;
    });
	$( "#description" ).dialog({
		autoOpen: true,
		show: "fade",
		hide: "fade",
		close: function(event, ui) {
			$("#control_description").attr('checked',false);
		},
		open: function(event, ui) {
			$("#control_description").attr('checked',true);
		}
	});
	$( "#description" ).dialog( "option", "position", '[top,left]' );
	$("#control_checks").buttonset();
	
	$("#control_reverse").change(function () {
		constants.speed = -constants.speed;
	});
	$("#control_description").change(function () {
		if ($(this).is(':checked')){
			$("#description").dialog( "open" );
		} else {
			$("#description").dialog( "close" );
		}
	});	
});
