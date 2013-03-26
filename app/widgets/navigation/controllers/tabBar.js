$.loadTabs = function(params){
	params = params || {};
	var tabs = params.tabs || [];
	for(var i in tabs){
		var tabData = tabs[i];
		tabData.size = _.size(tabs);
		tabData.tabIndex = i;
		var tabCtr = Alloy.createWidget("navigation", "tab", tabData);
		$.wrapper.add(tabCtr.getView());
	}
};

$.changeTab = function(index){

};