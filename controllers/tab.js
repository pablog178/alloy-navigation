var args = arguments[0] || {};

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
$.icon.selectedImage = args.selectedIcon || "";
$.tab.tabIndex = args.tabIndex;