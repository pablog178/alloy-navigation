var args = arguments[0] || {};

args.style && $.wrapper.applyProperties(args.style);

$.title.text = args.title || "";
$.icon.image = args.icon || "";
$.icon.selectedImage = args.selectedIcon || "";
$.wrapper.tabIndex = args.tabIndex;