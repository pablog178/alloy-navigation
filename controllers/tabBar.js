var args = arguments[0] || {};

if(_.size(args) > 0){
	$.wrapper.applyProperties(args);
}

$.loadTabs = function(params){
	params = params || {};
	var tabs = params.tabs || [];
	for(var i in tabs){
		var tabData = tabs[i];
		tabData.tabIndex = i;
		if(args.icons && args.icons[i]){
			tabData.icon = args.icons[i];
		}
		if(args.selectedIcons && args.selectedIcons[i]){
			tabData.selectedIcon = args.selectedIcons[i];
		}
		tabData.style = args.tab || null;
		var tabCtr = Alloy.createWidget("navigation", "tab", tabData);
		$.wrapper.add(tabCtr.getView());
	}
};

$.changeTab = function(index){

};