Alloy.Globals.navGroup = $.navGroup;
// var win1 = Alloy.createController("win1");
// var win2 = Alloy.createController("win2");
// var win3 = Alloy.createController("win3");
// var win4 = Alloy.createController("win4");
// var tabs = [
// 	{
// 		view: win1.getView(),
// 		title: "Tab 1"
// 	}, {
// 		view: win2.getView(),
// 		title: "Tab 2"
// 	}, {
// 		view: win3.getView(),
// 		title: "Tab 3"
// 	}, {
// 		view: win4.getView(),
// 		title: "Tab 4"
// 	}
// ];
$.navGroup.loadTabs({
	tabs : [
		{
			title: "Tab 1",
			controller: "win1"
		}, {
			title: "Tab 2",
			controller: "win2"
		}, {
			title: "Tab 3",
			controller: "win3"
		}, {
			title: "Tab 4",
			controller: "win4"
		}
	]
});
$.navGroup.window.open();