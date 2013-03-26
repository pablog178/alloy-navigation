Alloy.Globals.navGroup = $.navGroup;
var win1 = Alloy.createController("win1");
var win2 = Alloy.createController("win2");
var win3 = Alloy.createController("win3");
var win4 = Alloy.createController("win4");
var tabs = [
	{
		view: win1.getView(),
		title: "Window 1"
	}, {
		view: win2.getView(),
		title: "Window 2"
	}, {
		view: win3.getView(),
		title: "Window 3"
	}, {
		view: win4.getView(),
		title: "Window 4"
	}
];
$.navGroup.loadTabs({
	tabs : tabs
});
$.navGroup.window.open();