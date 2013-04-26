var args = arguments[0] || {};
var defaultStyle;

if(_.size(args) > 0){
	$.wrapper.applyProperties(args);
	args.back && $.back.applyProperties(args.back);
	args.title && $.title.applyProperties(args.title);
	defaultStyle = args.title || {};
}

var currents = {
	left: $.back
};
function addView (view, side) {
	if(currents[side] != view){
		var container = $[side + "View"];
		currents[side] && container.remove(currents[side]);
		currents[side] = view;
		if(currents[side]){
			container.add(currents[side]);
		}
	}
}

$.addLeftView = function(view){
	view = view || (view != false ? $.back : null);
	addView(view, "left");
};

$.addRightView = function(view){
	addView(view, "right");
};

$.updateStyle = function(style){
	style = style || defaultStyle;
	$.title.applyProperties(style);
};
