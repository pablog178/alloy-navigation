var args = arguments[0] || {};

$.setActive = function(state){
	if(state){
		$.icon.image = $.icon.selectedImage || $.icon.image;
		if(args.style.selectedBackground){
			$.tab.backgroundImage = args.style.selectedBackground;
		}
		if(args.style.title){
			$.title.color = $.title.selectedColor || $.title.color;
		}
	} else {
		$.icon.image = $.icon.normalImage || $.icon.image;
		if(args.style.selectedBackground){
			$.tab.backgroundImage = "";
		}
		if(args.style.title){
			$.title.color = $.title.normalColor || $.title.color;
		}
	}
};

if(args.style){
	$.tab.applyProperties(args.style);
	args.style.wrapper && $.wrapper.applyProperties(args.style.wrapper);
	args.style.icon && $.icon.applyProperties(args.style.icon);
	args.style.title && $.title.applyProperties(args.style.title);
	args.style.separator && $.separator.applyProperties(args.style.separator);
	args.style.hideSeparator && $.tab.remove($.separator);
}


$.title.text = args.title || "";
$.icon.image = args.icon || "";
$.icon.normalImage = args.icon || "";
$.icon.selectedImage = args.selectedIcon || "";
$.tab.tabIndex = args.tabIndex;