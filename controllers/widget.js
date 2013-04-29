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
$.components = components;

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
			var tab = navigation[currentTab];
			var view = _.last(tab).view;
			if(view.preventBack){
				return false;
			}
			if(tab.length <= 1 || view.exitOnClose){
				$.window.close();
			} else {
				$.close();
			}
		});
	}
}

function loadContent (view, animationOpts) {
	animationOpts = animationOpts || {};
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
			if(component){
				component.getView().visible = true;
			}
			component[position] = margins[position];
			margins[position] += component.getView().height;
		} else {
			if(component){
				component.getView().visible = false;
			}
		}
	}

	$.container.applyProperties(margins);

	if(components.header){
		components.header.title.text = view.title || "";
		components.header.updateStyle(view.titleStyle);
	}

	if(navigation[currentTab].length < 2){
		view.navLeftView = view.navLeftView || false;
	}

	components.header.addLeftView(view.navLeftView);
	components.header.addRightView(view.navRightView);

	if(OS_IOS && animationOpts.animate && !view.preventAnimation && openedContent && !openedContent.preventAnimation){
		view.zIndex = -1;
		$.container.add(view);
		var duration = 350;
		var screenWidth = 320;
		var imgView = view.toImage();
		var imgOpen = openedContent.toImage();

		var viewImg = Ti.UI.createImageView({
			top: 0,
			left: 0,
			image: imgView,
			width: imgView.width,
			height: imgView.height,
			touchEnabled: false
		});
		var openImg = Ti.UI.createImageView({
			top: 0,
			left: 0,
			image: imgOpen,
			width: imgOpen.width,
			height: imgOpen.height,
			touchEnabled: false
		});
		$.container.add(viewImg);
		$.container.add(openImg);


		var viewAnimation = {
			left: 0,
			duration: duration
		};
		var openAnimation = {
			left: -screenWidth,
			duration: duration
		};
		if(animationOpts.reverse){
			openAnimation.left = openAnimation.left * -1;
			viewImg.left = -screenWidth;
		} else {
			viewImg.left = screenWidth;
		}
		
		$.container.remove(openedContent);
		$.container.remove(view);
		Ti.API.debug("animating");
		viewImg.animate(viewAnimation);
		openImg.animate(openAnimation, function(){
			Ti.API.debug("freeing resources");
			//Free resources
			openedContent = null;
			openedContent = view;
			view.zIndex = 0;
			$.container.add(view);
		});
	} else {
		//Free resources
		$.container.add(view);
		openedContent && $.container.remove(openedContent);
		openedContent = null;
		openedContent = view;
	}

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
		var controller;
		var view;
		if(tab.view){
			view = tab.view;
		} else {
			controller = Alloy.createController(tab.controller, tab.args);
			view = controller.getView();
		}
		if(!navigation[i]){
			navigation[i] = [];
		}
		navigation[i].push({
			controller: controller,
			view: view
		});
		//Opens the first base view (from the first tab)
		if(i == currentTab){
			Ti.API.debug('Opens first view');
			loadContent(view);
		}
	}
	components.tabBar && components.tabBar.changeTab(currentTab);
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
		var tabIndex = params.tabIndex != null ? params.tabIndex : currentTab;
		var tab = navigation[tabIndex];
		tab.push({
			controller: controller,
			view: view
		});
		// tab = _.uniq(tab, true);
		if(tabIndex == currentTab){
			loadContent(view, {
				animate: true
			});
			controller.onOpen && controller.onOpen();
		}
	}

	return controller || view || null;
};

//Closes the top-most window from the tab (if specified)
$.close = function(params){
	Ti.API.debug('Close Window');
	params = params || {};

	//Obtain either the specified tab or the current one
	var tabIndex = params.tabIndex != null ? params.tabIndex : currentTab;
	var tab = navigation[tabIndex];
	var viewToClose;

	if(params.viewToClose){
		viewToClose = _.find(tab, function(info){
			return info.view == params.viewToClose;
		});
		tab = _.without(tab, viewToClose);
	} else {
		if(tab.length > 1){
			viewToClose = tab.pop();
		}
	}

	if(viewToClose){
		!params.preventLoad && loadContent(_.last(tab).view, {
			animate: true,
			reverse: true
		});
		viewToClose.controller && viewToClose.controller.finalize && viewToClose.controller.finalize();
		return true;
	}
	return false;
};

$.closeAll = function(params){
	params = params || {};
	var tabIndex = params.tabIndex != null ? params.tabIndex : currentTab;
	var tab = navigation[tabIndex];
	while(tab.length > 1){
		$.close({
			tabIndex: tabIndex,
			preventLoad: tab.length != 2
		});
	}
};

//Changes to a new tab, opening its top-most window
$.changeTab = function(tabIndex){
	Ti.API.debug('Change tab');

	if(navigation[tabIndex] && tabIndex !== currentTab){
		components.tabBar && components.tabBar.changeTab(tabIndex);
		currentTab = tabIndex;
		var tab = navigation[currentTab];
		loadContent(_.last(tab).view);
	}
};

init();