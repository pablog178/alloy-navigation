var currents = {};
function addView (view, side) {
	var container = $[side + "View"];
	currents[side] && container.remove(currents[side]);
	currents[side] = view;
	if(currents[side]){
		container.add(currents[side]);
	}
}

$.addLeftView = function(view){
	view = view || (view != false ? $.back : null);
	addView(view, "left");
};

$.addRightView = function(view){
	addView(view, "right");
};