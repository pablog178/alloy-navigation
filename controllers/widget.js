var args = arguments[0] || {};
//tabs base information (base controller window, title and icon)
$.tabsInfo = [];
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
			components[i] = Alloy.createWidget("navigation", i, (args[i] || null));
			component = components[i];
			var view = component.getView();
			view[position] = margins[position];
			$.window.add(view);
			margins[position] += view.height;
		}
	}
	components.header && components.header.back.addEventListener("click", $.close);
	//TODO Fix this for mobileweb (currently working since the tabBar is not presented on mobileweb)
	components.tabBar && components.tabBar.wrapper.addEventListener("click", function(evt){
		var tabIndex = evt.source.tabIndex;
		if(tabIndex != null){
			$.changeTab(tabIndex);
		}
	});

	if(OS_ANDROID){
		$.window.addEventListener("android:back", function(){
			if(navigation[currentTab].length > 1){
				$.close();
			} else {
				$.window.close();
			}
		});
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

	$.container.applyProperties(margins);

	if(components.header){
		components.header.title.text = view.title || "";
	}

	if(navigation[currentTab].length < 2){
		view.navLeftView = view.navLeftView || false;
	}

	components.header.addLeftView(view.navLeftView);
	components.header.addRightView(view.navRightView);

	openedContent && $.container.remove(openedContent);
	//Free resources
	openedContent = null;
	openedContent = view;
	$.container.add(view);
}

//loads a new array info of base tabs to be openned
$.loadTabs = function(params) {
	Ti.API.debug('Load tabs');
	
	params = params || {};
	$.tabsInfo = params.tabs || [];
	components.tabBar && components.tabBar.loadTabs(params);
	for(var i in $.tabsInfo){
		tab = $.tabsInfo[i];
		//window created from the controller and added to the navigation info
		var view = tab.view || Alloy.createController(tab.controller, tab.args).getView();
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
	var controller;
	if(params.controller){
		controller = Alloy.createController(params.controller, params.args);
	}
	var view = params.view || (controller && controller.getView());
	if(view){
		var tabIndex = params.tabIndex || currentTab;
		var tab = navigation[tabIndex];
		tab.push(view);
		// tab = _.uniq(tab, true);
		loadContent(view);
	}

	return controller || view || null;
};

//Closes the top-most window from the tab (if specified)
$.close = function(params){
	Ti.API.debug('Close Window');
	params = params || {};

	//Obtain either the specified tab or the current one
	var tabIndex = params.tabIndex || currentTab;
	var tab = navigation[tabIndex];
	var viewToClose;

	if(params.viewToClose){
		viewToClose = _.find(tab, function(view){
			return view == params.viewToClose;
		});
		tab = _.without(tab, viewToClose);
	} else {
		if(tab.length > 1){
			viewToClose = tab.pop();
		}
	}

	if(viewToClose){
		loadContent(_.last(tab));
	}
};

//Changes to a new tab, opening its top-most window
$.changeTab = function(tabIndex){
	Ti.API.debug('Change tab');

	if(navigation[tabIndex] && tabIndex !== currentTab){
		components.tabBar && components.tabBar.changeTab(tabIndex);
		currentTab = tabIndex;
		var tab = navigation[currentTab];
		loadContent(_.last(tab));
	}
};

init();