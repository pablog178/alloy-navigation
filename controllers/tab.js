var args = arguments[0] || {};

if(args.style){
	$.wrapper.applyProperties(args.style);
	args.style.icon && $.icon.applyProperties(args.style.icon);
	args.style.title && $.title.applyProperties(args.style.title);
}


$.title.text = args.title || "";
$.icon.image = args.icon || "";
$.icon.selectedImage = args.selectedIcon || "";
$.wrapper.tabIndex = args.tabIndex;