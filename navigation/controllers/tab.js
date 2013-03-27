var args = arguments[0] || {};
var size = args.size || 4;
$.wrapper.width = (size >= 4 ? "25%" : (100 / size).toFixed(0) + "%");
$.title.text = args.title || "";
$.icon.image = args.icon || "";
$.wrapper.tabIndex = args.tabIndex;