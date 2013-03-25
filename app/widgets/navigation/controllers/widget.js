//tabs base information (base controller window, title and icon)
var tabs = [];
//navigation information (contains a stack fo windows for each tab)
var navigation = {};
//index for current opened tab
var currentTab = 0;
//current openned window
var openedContent = null;
var components = {
	"header" : null,
	"tabBar" : null
};

function init () {
	var margins = {
		top 	: 0,
		bottom 	: 0,
		left	: 0,
		right	: 0
	};
	for(var i in components){
		var position = $.window.positions[i];
		if(position !== "none"){
			components[i] = Alloy.createWidget("navigation", i);
			component = components[i];
			var view = component.getView();
			view[position] = margins[position];
			$.window.add(view);
			margins[position] += view.height;
		}
	}
}

function loadContent (view) {
	view = view || {};
	var margins = {
		top 	: 0,
		bottom 	: 0,
		left 	: 0,
		right 	: 0
	};
	for(var i in components){
		var hiddenProperty = i + "Hidden";
		var position = $.window.positions[i];
		var component = components[i];
		if(!view[hiddenProperty] && position !== "none"){
			component[position] = margins[position];
			margins[position] += component.getView().height;
		} else {
			component && component.getView().hide();
		}
	}

	components.header.title = view.title || "";
	view.navLeftView 	&& components.header.addLeftView(view.navLeftView);
	view.navRightView && components.header.addRightView(view.navRightView);

	openedContent && $.container.remove(openedContent);
	//Free resources
	openedContent = null;
	openedContent = view;
}

//loads a new array info of base tabs to be openned
$.loadTabs = function(params) {
	Ti.API.debug('Load tabs');
	
	params = params || {};
	tabs = params.tabs || [];
	components.tabBar && components.tabBar.loadTabs(tabs);
	for(var i in tabs){
		var tab = tabs[i];
		//window created from the controller and added to the navigation info
		var view = tab.view;
		if(!navigation[i]){
			navigation[i] = [];
		}
		navigation[i].push(view);
		//Opens the first base view (from the first tab)
		if(i == currentTab){
			Ti.API.debug('Opens first view');
			loadContent(view);
		}
	}
};
//Opens a new window on the tab (if specified)
$.open = function(params){
	Ti.API.debug('Open new window');
	params = params || {};
	if(params.view){
		var tabIndex = params.tabIndex || currentTab;
		var tab = navigation[tabIndex];
		var view = params.view;
		tab.push(view);
		// tab = _.uniq(tab, true);
		loadContent(view);
	}
};

//Closes the top-most window from the tab (if specified)
$.close = function(params){
	Ti.API.debug('Close Window');
	params = params || {};

	//Obtain either the specified tab or the current one
	var tabIndex = params.tabIndex || currentTab;
	var tab = navigation[tabIndex];
	var viewToClose;
	if(parms.viewToClose){
		viewToClose = _.find(tab, function(view){
			return view == params.viewToClose;
		});
		tab = _.without(tab, viewToClose);
	} else {
		viewToClose = tab.pop();
	}
	$.container.remove(viewToClose);

	loadContent(_.last(tab));
};

//Changes to a new tab, opening its top-most window
$.changeTab = function(tabIndex){
	Ti.API.debug('Change tab');

	if(navigation[tabIndex]){
		components.tabBar && components.tabBar.changeTab(tabIndex);
		currentTab = tabIndex;
		var tab = navigation[currentTab];
		loadContent(_.last(tab));
	}
};

init();